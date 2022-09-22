import OrderItem from './OrderItem';

const OrderList = ({orders, msg}) => {
    return (<>
        <div className="flex flex-col rounded bg-white p-2 h-full max-h-full overflow-auto">
            {orders && orders.length !== 0 ? 
            orders.map((order) => (
                <OrderItem order={order}/>
            ))
            : <p className="error-msg">{msg}</p>}
        </div>
    </>)
}

export default OrderList