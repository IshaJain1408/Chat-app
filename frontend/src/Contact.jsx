import Avatar from "./Avatar.jsx";
const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  

// eslint-disable-next-line react/prop-types
export default function Contact({id,username,onClick,selected,online}) {
    const capitalizedUsername = capitalizeFirstLetter(username);

    
  return (
    <div key={id} onClick={() => onClick(id)}
         className={"border-b border-gray-100 shadow-inner flex items-center gap-2 cursor-pointer "+(selected ? 'bg-white'  : '')}>
      {selected && (
        <div className="w-1 h-12 bg-gray-900 rounded-r-md"></div>
      )}
      <div className="flex items-center gap-2 py-2 pl-4 text-white">
        <Avatar online={online} username={username} userId={id} />
        <span className="text-gray-900">{capitalizedUsername}</span>
        {online ? (
          <span className="text-xs text-green-500">Online</span>
        ) : (
          <span className="text-xs text-red-600">Offline</span>
        )}
      </div>
    </div>
  );
}
// Contact.jsx


