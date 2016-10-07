import React from 'react';
import AlertForm from './AlertForm';

//const fields = {  // used to populate
//    alertName: '',
//    product: 'smartphone',
//    ram: '512',
//    storage: '8',
//    dualChip: false,
//    rearCam: '4',
//    frontCam: '4',
//    price: ''
//};

class AddAlert extends React.Component {

    render() {
        return (
            <div className="container">
                <AlertForm />
            </div>
        )
    }
}

export default AddAlert
