// eslint-disable-next-line react/prop-types
export  default function Avatar({userId,username,online}){
    const colors =['bg-yellow-200','bg-red-200','bg-green-200','bg-purple-200','bg-blue-200',
    'bg-teal-200'];
    const userIdBase10=parseInt(userId, 16);
    const colorIndex=userIdBase10 % colors.length;
    const color=colors[colorIndex];
    // eslint-disable-next-line react/prop-types
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);

    return(
        <div className={"flex items-center w-8 h-8 relative  p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-200 "+color}>
           <div className="w-full text-center text-gray-900 opacity-70">{capitalizedUsername[0]}</div> 
           {online &&(
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border border-white rounded-full shadow-lg"></div>

           )}
           {!online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-700 border border-white rounded-full shadow-lg bg-red-6s00"></div>

           )}
        </div>
    )
}