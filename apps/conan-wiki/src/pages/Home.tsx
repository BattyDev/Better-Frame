export function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-display uppercase tracking-wide text-cn-accent-light">
        Conan Exiles Companion
      </h1>
      <p className="text-cn-text-dim max-w-2xl">
        Look up items, plan a wishlist with rolled-up resource costs, and pin
        landmarks on the map. Built on the Hyborian Wiki dataset — base game,
        both maps, all official DLC.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Search', body: '7,272 items with stats, crafting, drops.' },
          { title: 'Wishlist', body: 'Add items; get the base-resource list.' },
          { title: 'Map', body: 'Pan, zoom, pin landmarks and farming notes.' },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-cn-bg-card border border-cn-border rounded p-4"
          >
            <div className="text-cn-accent font-display uppercase text-sm tracking-wide mb-2">
              {card.title}
            </div>
            <div className="text-cn-text-dim text-sm">{card.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
