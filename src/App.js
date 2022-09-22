import {useState, useEffect} from 'react';
import BotList from './BotList';
import OrderList from './OrderList';
import { PROCESSING_TIME } from './config'
function App() {
  document.querySelector(':root').style.setProperty('--processingDuration', `${PROCESSING_TIME}s`);

  /**
   * Order Id Auto Increment Function
   * Auto increase order id when new order id is requested
   */
  const [orderId, setOrderId] = useState(0);
  
  const getNewOrderId = () => {
    setOrderId(orderId + 1)
    return orderId+1
  }

  /**
   * Order Lists Function
   * Create 2 order lists (normalOrders & vipOrders)
   * Combine them into 1 array (orders)
   * Render out orders as pending area
   */
  const [normalOrders, setNormalOrders] = useState([]);
  const [vipOrders, setVipOrders] = useState([]);
  const [orders, setOrders] = useState([]);  // Combined list of normalOrders & vipOrders

  // When new order is added to normalOrders or vipOrders, update orders
  useEffect(() => {
    setOrders([...vipOrders, ...normalOrders]);
  }, [normalOrders, vipOrders]);
  
  // New Normal Order Button Click
  const handleNewNormal = () => {
    const newOrderId = getNewOrderId()
    setNormalOrders([...normalOrders, {id: newOrderId, type: 'Normal', status: 'PENDING'}])
  }
  // New VIP Order Button Click
  const handleNewVIP = () => {
    const newOrderId = getNewOrderId()
    setVipOrders([...vipOrders, {id: newOrderId, type: 'VIP', status: 'PENDING'}])
  }

  /**
   * Completed Orders Function
   * use completedOrders to render Completed Orders
   */
  const [completedOrders, setCompletedOrders] = useState([]);

  /**
   * Bots Function
   * Render `bots` in Bots area
   */
  const [bots, setBots] = useState([]);


  const handleAddBot = () => {
    // create new bots with status IDEL, no processing order and interval
    // append into bots array
    setBots([...bots, {status: 'IDLE', processingOrder: null, inteval: null}])
  }

  const handleRemoveBot = () => {
    // get the last bot
    const removedBot = bots.pop()
    if(!removedBot) return

    // if bot is processing an order, set the order status to PENDING
    if(removedBot.processingOrder) {
      clearTimeout(removedBot.timeout) // stop the timeout to complete the order
      
      const order = removedBot.processingOrder
      
      // add order back to front of queue based on type
      switch(order.type){
        case 'Normal':
          setNormalOrders([order, ...normalOrders])
          break;
        case 'VIP':
          setVipOrders([order, ...vipOrders])
          break;
      }
    }
    // update bots array
    setBots([...bots])
  }

  // fire this function when an order timeout is completed
  const botComplete = (index, order) => {
    setBots(bots => {
      // get bots based on index number
      const bot = bots[index]

      // update completedOrders based on current completedOrders
      // append the order
      setCompletedOrders(completedOrders => [order,...completedOrders])

      // update bot status to IDLE
      // processingOrder to null
      // interval to null
      bot.status = 'IDLE'
      bot.processingOrder = null
      bot.interval = null
      return [...bots]
    })
  }


  /**
   * When these variables (orders, bots.length, completedOrders) change
   */
  useEffect(() => {
    // if no order, no update needed
    if(orders.length < 0)
      return
    // loop through bots array to receive orders
    const tempBots = bots.map((bot,index) => {

      // if bot is processing an order or no more order, skip
      if(bot.status === 'PROCESSING' || orders.length <= 0)
        return bot
      
      // get the first order from orders array
      const order = orders.shift()

      // remove order from their original array
      switch(order.type){
        case 'Normal':
          normalOrders.shift()
          setNormalOrders([...normalOrders])
          break;
        case 'VIP':
          vipOrders.shift()
          setVipOrders([...vipOrders])
          break;
      }

      // create a timeout to complete the order
      const timeout = setTimeout(() => {
        botComplete(index, order)
      },[PROCESSING_TIME*1000]) // PROCESSING_TIME * 1000ms)
      return {status: 'PROCESSING', processingOrder: order, timeout}
    })
    setBots([...tempBots])
  }, [orders, bots.length, completedOrders])

  return (<>
  <div className="bg-yellow-100">
    <div className="container mx-auto relative">
      {/* Header - Title*/}
      <h1 className="text-2xl p-3 bg-yellow-300 text-yellow-800 absolute w-full">McDonald's Order Controller</h1>

      {/* Main Body */}
      <div className="w-full h-screen h-min-screen ">
        <div className="h-full bg-white">

          {/* Top segments */}
          <div className="flex flex-row h-3/4">

            {/* First segment - Pending Orders */}
            <div className="p-3 w-1/3 bg-red-200 pt-16 pb-10">
              <h2 className="text-xl text-red-700">Pending Area</h2>
              <OrderList orders={orders} msg={"No Pending Orders"}/>
            </div>

            {/* Second segment - Bots */}
            <div className="p-3 w-1/3 bg-yellow-200 pt-16 pb-10">
              <h2 className="text-xl text-yellow-700">Cooking Bots</h2>
              <BotList bots={bots}/>
            </div>

            {/* Third segment - Completed Orders */}
            <div className="p-3 w-1/3 bg-green-200 pt-16 pb-10">
              <h2 className="text-xl text-green-700">Completed Area</h2>
              <OrderList orders={completedOrders} msg={"No Completed Orders"}/>
            </div>
          </div>
          
          {/* Bottom segment - Buttons */}
          <div className="flex flex-row h-1/4">

            {/* First segment - Add Order Buttons */}
            <div className="p-3 w-1/3 bg-red-400 flex flex-col">
              <h2 className="mb-2 text-white text-xl">Orders Operations</h2>
              <button className="button button-blue" onClick={handleNewNormal}>New Normal Order</button>
              <button className="button button-yellow mt-3" onClick={handleNewVIP}>New VIP Order</button>
            </div>

            {/* Second segment - Add & Remove Bots */}
            <div className="p-3 w-1/3 bg-yellow-400">
              <h2 className="mb-2 text-gray-700 text-xl">Bot Operations</h2>
              <div className="flex">
                <button className="button button-red w-1/2" onClick={handleRemoveBot}>- Bot</button>
                <button className="button button-green w-1/2" onClick={handleAddBot}>+ Bot</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>);
}

export default App;
