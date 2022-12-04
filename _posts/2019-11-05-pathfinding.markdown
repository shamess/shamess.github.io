---
layout: post
title:  "Unity and Dijkstra Pathfinding"
date:   2019-11-05 11:36:05 +0000
---

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/G8T5O6JN2-I?rel=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I'm pretty darned excited about Garry finally being able to pick apples from
trees. In the above video, Garry is the brown @. The player, moving around
randomly, is the white one. As it's turn based (and I'd not at the time of the
video implemented "wait") I had to shuffle the player character around.

Anyway, your focus should be on Garry, as he goes from tree (#) to tree,
stopping to eat the apple after collecting it.

It's using a version of Dijkstra's algorithm which I stole from [code
project][1], I think. It looks a little something like this in my version. One
difference that you'll spot from my version to the one there is that I start
building my node tree from the end. More on that later.

Start with the Node - one of the points along the path.

```
public class PathfindingNode {
  // A super high value for the moment. This will get updated with the number of
  // steps required to get to this number from the end to this point.
  public int MinCostToStart = int.MaxValue;

  // For me, the cost is always 1. However, you can use this be to higher for
  // values that the pathfinder should prefer not to follow. 1 for a clean
  // pathway, but 2 for a muddy field.
  public int Cost = 1;

  // This'll be used to make sure we don't figure out the distance from the end
  // more than once. After the first time we spot this node, it'll always be
  // further away.
  public bool Visited = false;

  // Used to determine which nodes are next to this one, as my world is a grid
  // system.
  public Vector2 Location;

  // The node closest to destination. It'll get added later on.
  public PathfindingNode NearestToEnd;

  public PathfindingNode (Vector2 location) {
    Location = location;
  }
}
```

The other crucial object you'll need is a repository that lets you ask for the
adjacent nodes. In my case, the repository is also in charge of creating all the
newly requested Nodes.

```
public class PathfindingNodeRepository {
  // The in-memory store of Nodes we described above.
	readonly List<PathfindingNode> nodes;
  // The solid structures of my world - buildings and trees - are all defined in
  // a "map". I use this later on to determine if something is a valid position
  // to move through.
	readonly Map map;
  // These are locations which move around a bunch. An refactoring here could be
  // that this and the `map` argument are replaced with a simple
  // 'passableLocations' array to simplify this.
	readonly Vector2[] locationsToAvoid;

	public PathfindingNodeRepository (Map map, Vector2[] locationsToAvoid) {
		this.map = map;

		nodes = new List<PathfindingNode>();
		this.locationsToAvoid = locationsToAvoid;
	}

  // If you can't find a node in-memory, simply create it.
	public PathfindingNode Find (Vector2 location) {
		PathfindingNode found = nodes.Find(n => location == n.Location);

		if (found != null) return found;

		PathfindingNode node = new PathfindingNode(location);
		nodes.Add(node);

		return node;
	}

  // As this is a coordinate based system, getting the nodes which are side by
  // side with the one we're interested in is relatively simple.
	public List<PathfindingNode> GetAdjacentNodes (PathfindingNode node) {
    // These are the eight coordinates "next" to our Node.
		Vector2[] directions = new Vector2[8];
    // This order actually is important! It allows diagonal movement, but
    // prefers cardianal directions.
		directions[0] = new Vector2(0, -1);
		directions[1] = new Vector2(-1, 0);
		directions[2] = new Vector2(1, 0);
		directions[3] = new Vector2(0, 1);

		directions[4] = new Vector2(-1, -1);
		directions[5] = new Vector2(1, -1);
		directions[6] = new Vector2(-1, 1);
		directions[7] = new Vector2(1, 1);

		List<PathfindingNode> adjacent = new List<PathfindingNode>();

		foreach (Vector2 direction in directions) {
			Vector2 location = node.Location + direction;

      // Check if the location is passable and that we're not avoiding it.
			bool passable = map.ValidMovementPosition(location) &&
				!Array.Exists<Vector2>(locationsToAvoid, avoid => avoid == location);

			if (passable) {
				adjacent.Add(Find(location));
			}
		}

		return adjacent;
	}
}
```

The final piece of the algorithm itself.

```
public class PathfindingDijkstra {
	private readonly PathfindingNode start;
	private readonly PathfindingNode end;
	private readonly PathfindingNodeRepository repo;

	public PathfindingDijkstra (PathfindingNode start, PathfindingNode end, PathfindingNodeRepository repo) {
		this.start = start;
		this.end = end;
		this.repo = repo;

		BuildNodes();
	}

  // Outside of the Pathfinding codebase it is more likely that you'll know the
  // Vector2 rather than have access to the PathfindingNode.
	public PathfindingDijkstra (Vector2 start, Vector2 end, PathfindingNodeRepository repo) {
		this.start = repo.Find(start);
		this.end = repo.Find(end);
		this.repo = repo;

		BuildNodes();
	}

	public Vector2[] GetShortestPath () {
		List<PathfindingNode> shortestPath = new List<PathfindingNode> { start };

		BuildShortestPath(shortestPath, start);

		Vector2[] shortestListOfVectors = new Vector2[shortestPath.Count];
		int i = 0;
		foreach (PathfindingNode node in shortestPath) {
			shortestListOfVectors[i] = node.Location;
			i += 1;
		}

		return shortestListOfVectors;
	}

	private void BuildNodes () {
    // The destination node obviously has a 0 cost to get to it.
		end.MinCostToStart = 0;
    // Kick off our priority queue with the end node.
		List<PathfindingNode> priorityQueue = new List<PathfindingNode> { end };

		do {
      // Always order this by the lowest cost node to get to - it's more likely
      // to give us the shortest route. This obviously doesn't make sense the
      // first time around this `do`, but once we start adding all the adjacent
      // Nodes in here, it'll become vital.
			priorityQueue = priorityQueue.OrderBy(x => x.MinCostToStart).ToList();
			PathfindingNode node = priorityQueue.First();
			priorityQueue.Remove(node);

      // In the code [code project][1] they also order this, though I'm not sure
      // it does anything except slow down the whole thing. I especially don't
      // need it as all my costs are the same.
			foreach (var adjacentNode in repo.GetAdjacentNodes(node)) {
				if (adjacentNode.Visited) continue;

        // We need to check this to make sure the NearestToEnd is always the
        // closest node. It's possible that we've spotted this node before but
        // by a less efficient route.
				if (node.MinCostToStart + adjacentNode.Cost < adjacentNode.MinCostToStart) {
					adjacentNode.MinCostToStart = node.MinCostToStart + adjacentNode.Cost;
					adjacentNode.NearestToEnd = node;

          // If this is the first time we've ever seen this node, pop it in
          // the queue. 
					if (!priorityQueue.Contains(adjacentNode)) priorityQueue.Add(adjacentNode);
				}
			}

			node.Visited = true;
      // Don't bother carrying on if we've found our way to the start.
			if (node == start) return;
		} while (priorityQueue.Count > 0);
	}

	private void BuildShortestPath (List<PathfindingNode> list, PathfindingNode node) {
		if (node.NearestToEnd == null) return;

		list.Add(node.NearestToEnd);
		BuildShortestPath(list, node.NearestToEnd);
	}
}
```

The problem I bumped into, which lead to me swapping around the Node to start
building that path from was when the End node is inaccessible. This is almost
always the case, as what I actually want is "get me the path to the point just
before the End". The End is usually an apple tree that can't be walked past. As
you see in the repository, it won't get returned by GetAdjacentNodes, so it can
never be found from Start.

It's important to split out your pathfinding code from the domain of your game
because you'll be changing the above code quite a lot when you think about
optimisations. There's a great deal of work that can be done above to improve
this code:

* Cache some routes, rather than needing to throw away Nodes every time.
* Switch to A* pathfinding, at the very least.
* Switch to a faster OrderBy.

The aim is to make it so that you game doesn't have to change when you improve
the pathfinding system.

[1]: https://www.codeproject.com/Articles/1221034/Pathfinding-Algorithms-in-Csharp
