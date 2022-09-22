exports.getOrderTypeBgColor = (orderType) => {
    switch(orderType) {
        case 'Normal':
            return 'bg-blue-200'
        case 'VIP':
            return 'bg-yellow-200'
    }
}