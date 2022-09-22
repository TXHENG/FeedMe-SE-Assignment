import {getOrderTypeBgColor} from './util'

const OrderItem = ({order}) => {
    return (<>
        <div className={"p-2 rounded mb-1 " + getOrderTypeBgColor(order.type)}>
            <span className="inline-block w-14 h-14 text-center py-2 text-red-500 bg-white font-bold text-2xl">{order.id}</span>
            <span className="inline-block ml-2">{order.type} Order</span>
        </div>
    </>)
}

export default OrderItem