var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var request = require('request');
var qs = require('querystring');
var User = require('../models/User');

function generateToken(user) {
    var payload = {
        iss: 'localhost',
        sub: user.id,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    };
    return jwt.sign(payload, process.env.TOKEN_SECRET);
}

var mailAuth = {
    auth: {
        api_key: 'key-81424b07942e163bb760fdc88198ee70',
        domain: 'sandbox2ba027822c204b4383da167aaabef499.mailgun.org'
    }
};

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
};
/**
 * POST /login
 * Sign in with email and password
 */
exports.loginPost = function (req, res, next) {
    req.assert('email', 'Email inválido').isEmail();
    req.assert('email', 'Email não pode estar em branco.').notEmpty();
    req.assert('password', 'Senha não pode estar em branco.').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (!user) {
            return res.status(401).send({ msg: 'Senha ou email inválidos.' });
        }
        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ msg: 'Senha ou email inválidos.' });
            }
            res.send({ token: generateToken(user), user: user.toJSON() });
        });
    });
};

/**
 * POST /signup
 */
exports.signupPost = function (req, res, next) {
    req.assert('name', 'Name não pode estar em branco.').notEmpty();
    req.assert('email', 'Email inválido').isEmail();
    req.assert('email', 'Email não pode estar em branco.').notEmpty();
    req.assert('password', 'senha deve ter pelo menos 4 caracteres').len(4);
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (user) {
            return res.status(400).send({ msg: 'Este email já está associado com outra conta.' });
        }
        user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        user.save(function (err) {
            res.send({ token: generateToken(user), user: user });
        });
    });
};


/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = function (req, res, next) {
    if ('password' in req.body) {
        req.assert('password', 'Senha deve ter pelo menos 4 caracteres').len(4);
        req.assert('confirm', 'Senha deve ser válida').equals(req.body.password);
    } else {
        req.assert('email', 'Email inválido').isEmail();
        req.assert('email', 'Email não pode estar em branco.').notEmpty();
        req.sanitize('email').normalizeEmail({ remove_dots: false });
    }

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    User.findById(req.user.id, function (err, user) {
        if ('password' in req.body) {
            user.password = req.body.password;
        } else {
            user.email = req.body.email;
            user.name = req.body.name;
            user.gender = req.body.gender;
            user.location = req.body.location;
            user.website = req.body.website;
        }
        user.save(function (err) {
            if ('password' in req.body) {
                res.send({ msg: 'Your senha has been changed.' });
            } else if (err && err.code === 11000) {
                res.status(409).send({ msg: 'O email inserido já está associado com outra conta.' });
            } else {
                res.send({ user: user, msg: 'Perfil atualizado..' });
            }
        });
    });
};

/**
 * DELETE /account
 */
exports.accountDelete = function (req, res, next) {
    User.remove({ _id: req.user.id }, function (err) {
        res.send({ msg: 'Conta deletada :(' });
    });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = function (req, res, next) {
    User.findById(req.user.id, function (err, user) {
        switch (req.params.provider) {
        case 'facebook':
            user.facebook = undefined;
            break;
        case 'google':
            user.google = undefined;
            break;
        case 'twitter':
            user.twitter = undefined;
            break;
        case 'vk':
            user.vk = undefined;
            break;
        case 'github':
            user.github = undefined;
            break;
        default:
            return res.status(400).send({ msg: 'Invalid OAuth Provider' });
        }
        user.save(function (err) {
            res.send({ msg: 'Your account has been unlinked.' });
        });
    });
};

/**
 * POST /forgot
 */
exports.forgotPost = function (req, res, next) {
    req.assert('email', 'Email inválido').isEmail();
    req.assert('email', 'Email não pode estar em branco.').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    async.waterfall([
        function (done) {
            crypto.randomBytes(16, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        function (token, done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    return res.status(400).send({ msg: 'O email ' + req.body.email + ' não é associado com nenhuma conta.' });
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 86400000; // 1 dia
                user.save(function (err) {
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {
            var nodemailerMailgun = nodemailer.createTransport(mg(mailAuth));
            nodemailerMailgun.sendMail({
                from: 'postmaster@sandbox2ba027822c204b4383da167aaabef499.mailgun.org',
                to: user.email,
                subject: '✔ Reinicia sua senha para o BuyBox!',
                text: 'Por favor, acesse o link abaixo clicando ou colando no navegador para completar o processo:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'Se você não deseja reiniciar sua senha, favor ignorar este email.\n'
            }, function (err, info) {
                if (err) {
                    console.log('Error: ' + err);
                }
                else {
                    console.log('Response: ' + info);
                    res.status(200).send();
                }
            });
        }
    ]);
};

/**
 * POST /reset
 */
exports.resetPost = function (req, res, next) {
    req.assert('password', 'Senha deve ter pelo menos 4 caracteres').len(4);
    req.assert('confirm', 'Senha deve ser igual').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        return res.status(400).send(errors);
    }

    async.waterfall([
        function (done) {
            User.findOne({ passwordResetToken: req.params.token })
                .where('passwordResetExpires').gt(Date.now())
                .exec(function (err, user) {
                    if (!user) {
                        return res.status(400).send({ msg: 'Password reset token is invalid or has expired.' });
                    }
                    user.password = req.body.password;
                    user.passwordResetToken = undefined;
                    user.passwordResetExpires = undefined;
                    user.save(function (err) {
                        done(err, user);
                    });
                });
        },
        function (user, done) {
            var transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD
                }
            });
            var mailOptions = {
                from: 'support@yourdomain.com',
                to: user.email,
                subject: 'Sua senha BuyBox foi alterada!',
                text: 'Hello,\n\n' +
                'Essa é uma confirmação que sua senha para o email ' + user.email + ' foi alterada.\n'
            };
            transporter.sendMail(mailOptions, function (err) {
                res.send({ msg: 'Sua senha foi alterada com sucesso.' });
            });
        }
    ]);
};

/**
 * POST /auth/facebook
 * Sign in with Facebook
 */
exports.authFacebook = function (req, res) {
    var profileFields = ['id', 'name', 'email', 'gender', 'location'];
    var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + profileFields.join(',');

    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: process.env.FACEBOOK_SECRET,
        redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function (err, response, accessToken) {
        if (accessToken.error) {
            return res.status(500).send({ msg: accessToken.error.message });
        }

        // Step 2. Retrieve user's profile information.
        request.get({ url: graphApiUrl, qs: accessToken, json: true }, function (err, response, profile) {
            if (profile.error) {
                return res.status(500).send({ msg: profile.error.message });
            }

            // Step 3a. Link accounts if user is authenticated.
            if (req.isAuthenticated()) {
                User.findOne({ facebook: profile.id }, function (err, user) {
                    if (user) {
                        return res.status(409).send({ msg: 'Já existe uma conta associada com Facebook que pertence a você.' });
                    }
                    user = req.user;
                    user.name = user.name || profile.name;
                    user.gender = user.gender || profile.gender;
                    user.picture = user.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
                    user.facebook = profile.id;
                    user.save(function () {
                        res.send({ token: generateToken(user), user: user });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({ facebook: profile.id }, function (err, user) {
                    if (user) {
                        return res.send({ token: generateToken(user), user: user });
                    }
                    User.findOne({ email: profile.email }, function (err, user) {
                        if (user) {
                            return res.status(400).send({ msg: user.email + ' está associado com outra conta.' })
                        }
                        user = new User({
                            name: profile.name,
                            email: profile.email,
                            gender: profile.gender,
                            location: profile.location && profile.location.name,
                            picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
                            facebook: profile.id
                        });
                        user.save(function (err) {
                            return res.send({ token: generateToken(user), user: user });
                        });
                    });
                });
            }
        });
    });
};

exports.authFacebookCallback = function (req, res) {
    res.render('loading');
};
/**
 * POST /auth/google
 * Sign in with Google
 */
exports.authGoogle = function (req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';

    var params = {
        code: req.body.code,
        client_id: req.body.clientId,
        client_secret: process.env.GOOGLE_SECRET,
        redirect_uri: req.body.redirectUri,
        grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function (err, response, token) {
        var accessToken = token.access_token;
        var headers = { Authorization: 'Bearer ' + accessToken };

        // Step 2. Retrieve user's profile information.
        request.get({ url: peopleApiUrl, headers: headers, json: true }, function (err, response, profile) {
            if (profile.error) {
                return res.status(500).send({ message: profile.error.message });
            }
            // Step 3a. Link accounts if user is authenticated.
            if (req.isAuthenticated()) {
                User.findOne({ google: profile.sub }, function (err, user) {
                    if (user) {
                        return res.status(409).send({ msg: 'Já existe uma conta associada com Google que pertence a você.' });
                    }
                    user = req.user;
                    user.name = user.name || profile.name;
                    user.gender = profile.gender;
                    user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
                    user.location = user.location || profile.location;
                    user.google = profile.sub;
                    user.save(function () {
                        res.send({ token: generateToken(user), user: user });
                    });
                });
            } else {
                // Step 3b. Create a new user account or return an existing one.
                User.findOne({ google: profile.sub }, function (err, user) {
                    if (user) {
                        return res.send({ token: generateToken(user), user: user });
                    }
                    user = new User({
                        name: profile.name,
                        email: profile.email,
                        gender: profile.gender,
                        picture: profile.picture.replace('sz=50', 'sz=200'),
                        location: profile.location,
                        google: profile.sub
                    });
                    user.save(function (err) {
                        res.send({ token: generateToken(user), user: user });
                    });
                });
            }
        });
    });
};

exports.authGoogleCallback = function (req, res) {
    res.render('loading');
};
/**
 * POST /auth/twitter
 * Sign in with Twitter
 */
exports.authTwitter = function (req, res) {
    var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
    var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
    var profileUrl = 'https://api.twitter.com/1.1/users/show.json?screen_name=';
    var credentialsUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

    // Part 1 of 2: Initial POST request to obtain OAuth request token.
    if (!req.body.oauth_token || !req.body.oauth_verifier) {
        var requestTokenOauthSignature = {
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_SECRET,
            callback: req.body.redirectUri
        };

        // Step 1. Obtain request token to initiate app authorization.
        // At this point nothing is happening inside a popup yet.
        request.post({ url: requestTokenUrl, oauth: requestTokenOauthSignature }, function (err, response, body) {
            var oauthToken = qs.parse(body);

            // Step 2. Send OAuth token back.
            // After request token is sent back, a popup will redirect to the Twitter app authorization screen.
            // Unlike Facebook and Google (OAuth 2.0), we have to do this extra step for Twitter (OAuth 1.0).
            res.send(oauthToken);
        });
    } else {
        // Part 2 of 2: Second POST request after "Authorize app" button is clicked.
        // OAuth 2.0 basically starts from Part 2, but with OAuth 1.0 we need to do that extra step in Part 1.
        var accessTokenOauth = {
            consumer_key: process.env.TWITTER_KEY,
            consumer_secret: process.env.TWITTER_SECRET,
            token: req.body.oauth_token,
            verifier: req.body.oauth_verifier
        };

        // Step 3. Exchange "oauth token" and "oauth verifier" for access token.
        request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function (err, response, accessToken) {
            accessToken = qs.parse(accessToken);

            var profileOauth = {
                consumer_key: process.env.TWITTER_KEY,
                consumer_secret: process.env.TWITTER_SECRET,
                oauth_token: accessToken.oauth_token
            };

            // Step 4. Retrieve user's profile information.
            request.get({
                url: profileUrl + accessToken.screen_name,
                oauth: profileOauth,
                json: true
            }, function (err, response, profile) {

                // Step 5a. Link accounts if user is authenticated.
                if (req.isAuthenticated()) {
                    User.findOne({ twitter: profile.id }, function (err, user) {
                        if (user) {
                            return res.status(409).send({ msg: 'Já existe uma conta associada com Twitter ' +
                            'que pertence a você.' });
                        }
                        user = req.user;
                        user.name = user.name || profile.name;
                        user.picture = user.picture || profile.profile_image_url_https;
                        user.location = user.location || profile.location;
                        user.twitter = profile.id;
                        user.save(function (err) {
                            res.send({ token: generateToken(user), user: user });
                        });
                    });
                } else {
                    // Step 5b. Create a new user account or return an existing one.
                    User.findOne({ twitter: profile.id }, function (err, user) {
                        if (user) {
                            return res.send({ token: generateToken(user), user: user });
                        }
                        // Twitter does not provide an email address, but email is a required field in our User schema.
                        // We can "fake" a Twitter email address as follows: username@twitter.com.
                        user = new User({
                            name: profile.name,
                            email: profile.email || profile.screen_name + '@twitter.com',
                            location: profile.location,
                            picture: profile.profile_image_url_https,
                            twitter: profile.id
                        });
                        user.save(function () {
                            res.send({ token: generateToken(user), user: user });
                        });
                    });
                }
            });
        });
    }
};

exports.authTwitterCallback = function (req, res) {
    res.render('loading');
};
