import Avatar from "./Avatar"
// eslint-disable-next-line react/prop-types
const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
// eslint-disable-next-line react/prop-types
const Profile = ({id,username,onClick,selected,online}) => {
    const capitalizedUsername = capitalizeFirstLetter(username);

  return (
    <div key={id} onClick={() => onClick(id)}
    className={" flex items-center gap-2 cursor-pointer "+(selected ? '' : '')}>
 {selected && (
   <div className="w-1 h-12 rounded-r-md"></div>
 )}
 <div className="flex items-center gap-2 py-2 pl-4 text-black">
   <Avatar online={online} username={username} userId={id} />
   <div  className="flex flex-col text-base text-gray-900 ">{capitalizedUsername}
   {online ? (
          <p  className="text-xs text-green-500 ">Online</p>
        ) : (
          <p className="text-xs text-red-600">Offline</p>
        )}
        </div>
 </div>
</div>
  )
}

export default Profile