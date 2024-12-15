// Create nodes and edges for the graph
const nodes = new vis.DataSet([
    { id: 'A', label: 'A' },
    { id: 'B', label: 'B' },
    { id: 'C', label: 'C' },
    { id: 'D', label: 'D' },
    { id: 'E', label: 'E' },
    { id: 'F', label: 'F' },
    { id: 'G', label: 'G' }
]);

const edges = new vis.DataSet([
    { from: 'A', to: 'B', label: '2', value: 2 },
    { from: 'A', to: 'E', label: '3', value: 3 },
    { from: 'A', to: 'F', label: '5', value: 5 },
    { from: 'B', to: 'F', label: '1', value: 1 },
    { from: 'B', to: 'G', label: '4', value: 4 },
    { from: 'C', to: 'D', label: '4', value: 4 },
    { from: 'C', to: 'F', label: '2', value: 2 },
    { from: 'C', to: 'G', label: '6', value: 6 },
    { from: 'D', to: 'E', label: '2', value: 2 },
    { from: 'D', to: 'F', label: '3', value: 3 },
    { from: 'E', to: 'F', label: '2', value: 2 },
    { from: 'F', to: 'G', label: '2', value: 2 }
]);

// Configure and create network visualization
const container = document.getElementById('graph');
const data = { nodes: nodes, edges: edges };
const options = {
    edges: {
        font: { align: 'middle' },
        arrows: 'to'
    },
    nodes: {
        shape: 'circle'
    },
    physics: {
        enabled: true
    }
};
const network = new vis.Network(container, data, options);

// Dijkstra's Algorithm Implementation
function dijkstra(graph, start, end) {
    const distances = {};
    const previousNodes = {};
    const visited = new Set();
    const queue = new Set(Object.keys(graph));

    // Initialize distances and previous nodes
    for (let node in graph) {
        distances[node] = Infinity;
        previousNodes[node] = null;
    }
    distances[start] = 0;

    while (queue.size > 0) {
        // Get the node with the smallest distance
        let currentNode = Array.from(queue).reduce((minNode, node) => 
            distances[node] < distances[minNode] ? node : minNode
        );

        if (currentNode === end) break;
        queue.delete(currentNode);
        visited.add(currentNode);

        for (let neighbor in graph[currentNode]) {
            if (!visited.has(neighbor)) {
                let newDist = distances[currentNode] + graph[currentNode][neighbor];
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    previousNodes[neighbor] = currentNode;
                }
            }
        }
    }

    // Reconstruct path
    const path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previousNodes[current];
    }
    return { distance: distances[end], path };
}

// Graph data as an adjacency list for Dijkstra
const graph = {
    A: { B: 2, E: 3, F: 5 },
    B: { A: 2, F: 1, G: 4 },
    C: { D: 4, F: 2, G: 6 },
    D: { C: 4, E: 2, F: 3 },
    E: { A: 3, D: 2, F: 2 },
    F: { A: 5, B: 1, C: 2, D: 3, E: 2, G: 2 },
    G: { B: 4, C: 6, F: 2 }
};

// Function to find the shortest path
function findShortestPath() {
    const source = document.getElementById("sourceNode").value.toUpperCase();
    const destination = document.getElementById("destinationNode").value.toUpperCase();

    if (!graph[source] || !graph[destination]) {
        alert("Invalid source or destination node! Use A-G.");
        return;
    }

    const result = dijkstra(graph, source, destination);
    const outputDiv = document.getElementById("output");

    if (result.distance === Infinity) {
        outputDiv.textContent = `No path exists between ${source} and ${destination}.`;
    } else {
        outputDiv.textContent = `Shortest Path: ${result.path.join(" -> ")}\nDistance: ${result.distance}`;
    }

    // Highlight path in the graph
    highlightPath(result.path);
}

// Highlight the path in the graph
function highlightPath(path) {
    // Reset all edges to default color
    edges.update(edges.get().map(edge => ({ ...edge, color: { color: 'black' } })));
    
    // Highlight the edges in the path
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const edge = edges.get({ filter: edge => (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from) })[0];
        if (edge) {
            edges.update({ id: edge.id, color: { color: 'red' } });
        }
    }
}


