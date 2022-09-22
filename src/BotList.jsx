import { getOrderTypeBgColor } from "./util"
const BotList = ({bots}) => {

    const getBotStatusColor = (status, orderType) => {
        switch (status) {
        case 'IDLE':
            return 'bg-gray-200'
        case 'PROCESSING':
            return getOrderTypeBgColor(orderType)
        }
    }

    return (<>
        <div className="flex flex-wrap justify-start items-start rounded bg-white p-2 h-full max-h-full overflow-auto">
        {bots && bots.length !== 0 ? 
            bots.map((bot, index) => {
            return <div key={index} className="inline text-center w-1/3 m-0">
                <div className={`text-sm flex flex-col p-2 rounded m-2 h-24 ${ getBotStatusColor(bot.status, bot.processingOrder?.type) }`}>
                <span className='text-lg'>Bot {index+1}</span>
                <span className="font-bold">{bot.status}</span>
                <span>{bot.processingOrder ? `Order ${bot.processingOrder.id} (${bot.processingOrder.type})` : ''}</span>
                {bot.processingOrder && <div className="bg-white h-2 w-full rounded"><div className="bg-green-500 h-2 rounded processing w-full"></div></div>}
                </div>
            </div>
            })
        : <p className="error-msg">No Bots</p>}
        </div>
    </>)
}

export default BotList