function ServerCard(server) {
  console.log(server);
  return (
    <div className="card bg-base-100 w-full h-full flex flex-col rounded-lg overflow-hidden hover:scale-105 transition-shadow relative">
      <figure className="px-10 pt-10">
        {server.server.icon ? (
          <img
            src={server.server.icon}
            alt="Shoes"
            className="rounded-xl w-full h-full"
          />
        ) : (
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{server.server.name}</h2>
        <p>Member count: {server.server.member_count}</p>
        <div className="card-actions">
          {server.server.server_link ? (
            <a className="btn btn-primary" href={server.server.server_link}>
              Join server
            </a>
          ) : (
            <button className="btn btn-primary" disabled>
              No link available
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServerCard;
