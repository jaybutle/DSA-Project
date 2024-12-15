// Create nodes with storage capacities
const nodes = new vis.DataSet([
    { id: 'A', label: 'A\n10000kg', capacity: 10000 },
    { id: 'B', label: 'B\n5000kg', capacity: 5000 },
    { id: 'C', label: 'C\n4500kg', capacity: 4500 },
    { id: 'D', label: 'D\n7000kg', capacity: 7000 },
    { id: 'E', label: 'E\n8000kg', capacity: 8000 },
    { id: 'F', label: 'F\n9000kg', capacity: 9000 },
    { id: 'G', label: 'G\n6000kg', capacity: 6000 }
]);

// Create edges (connections with distances)
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

// Initialize graph
const container = document.getElementById('graph');
const data = { nodes: nodes, edges: edges };
const options = { nodes: { shape: 'circle' }, edges: { arrows: 'to' } };
const network = new vis.Network(container, data, options);

// Graph adjacency list for Dijkstra
const graph = {
    A: { B: 2, E: 3, F: 5 },
    B: { A: 2, F: 1, G: 4 },
    C: { D: 4, F: 2, G: 6 },
    D: { C: 4, E: 2, F: 3 },
    E: { A: 3, D: 2, F: 2 },
    F: { A: 5, B: 1, C: 2, D: 3, E: 2, G: 2 },
    G: { B: 4, C: 6, F: 2 }
};

// Dijkstra Algorithm
function dijkstra(graph, start, end) {
    const distances = {};
    const previous = {};
    const queue = new Set(Object.keys(graph));

    for (let node in graph) distances[node] = Infinity;
    distances[start] = 0;

    while (queue.size) {
        let current = Array.from(queue).reduce((min, node) => distances[node] < distances[min] ? node : min);
        if (current === end) break;
        queue.delete(current);

        for (let neighbor in graph[current]) {
            let newDist = distances[current] + graph[current][neighbor];
            if (newDist < distances[neighbor]) {
                distances[neighbor] = newDist;
                previous[neighbor] = current;
            }
        }
    }

    const path = [];
    let current = end;
    while (current) {
        path.unshift(current);
        current = previous[current];
    }

    return { distance: distances[end], path };
}

// Shortest Path Finder
function findShortestPath() {
    const source = document.getElementById("sourceNode").value.toUpperCase();
    const destination = document.getElementById("destinationNode").value.toUpperCase();
    const result = dijkstra(graph, source, destination);

    document.getElementById("output").innerText =
        result.distance === Infinity
            ? "No path exists."
            : `Shortest Path: ${result.path.join(" -> ")}\nDistance: ${result.distance}`;
}

// Find Nearby Depots for Storage
function findNearbyDepots() {
    const storageAmount = parseInt(document.getElementById("storageAmount").value);
    if (!storageAmount || storageAmount <= 0) {
        alert("Please enter a valid storage amount.");
        return;
    }

    const suitableDepots = nodes.get().filter(node => node.capacity >= storageAmount);
    if (suitableDepots.length === 0) {
        document.getElementById("output").innerText = "No depots can accommodate the storage amount.";
    } else {
        const result = suitableDepots.map(depot => `${depot.label}`).join(", ");
        document.getElementById("output").innerText = `Nearby Suitable Depots: ${result}`;
    }
}
// Find Nearby Depots for Storage based on Dijkstra's Algorithm
function findNearbyDepots() {
    const storageAmount = parseInt(document.getElementById("storageAmount").value);
    const sourceNode = document.getElementById("sourceNode").value.toUpperCase();
    
    if (!graph[sourceNode]) {
        alert("Invalid source node! Use A-G.");
        return;
    }

    if (!storageAmount || storageAmount <= 0) {
        alert("Please enter a valid storage amount.");
        return;
    }

    // Find all depots that meet the storage requirement
    const suitableDepots = nodes.get().filter(node => node.capacity >= storageAmount);

    if (suitableDepots.length === 0) {
        document.getElementById("output").innerText = "No depots can accommodate the storage amount.";
        return;
    }

    // Run Dijkstra's algorithm to calculate distances from the source node
    const distances = {};
    suitableDepots.forEach(depot => {
        const result = dijkstra(graph, sourceNode, depot.id);
        distances[depot.id] = result.distance;
    });

    // Find the nearest depot
    let nearestDepot = null;
    let minDistance = Infinity;
    for (let depot of suitableDepots) {
        if (distances[depot.id] < minDistance) {
            minDistance = distances[depot.id];
            nearestDepot = depot;
        }
    }

    // Display result
    if (nearestDepot) {
        document.getElementById("output").innerText =
            `Nearest Depot: ${nearestDepot.label.split("\n")[0]} (Storage: ${nearestDepot.capacity}kg)\nDistance: ${minDistance}`;
    } else {
        document.getElementById("output").innerText = "No nearby depots found.";
    }
}
// Function to find nearby depots and animate the shortest path
function findNearbyDepots() {
    const storageAmount = parseInt(document.getElementById("storageAmount").value);
    const sourceNode = document.getElementById("sourceNode").value.toUpperCase();

    // Validate input
    if (!graph[sourceNode]) {
        alert("Invalid source node! Use A-G.");
        return;
    }

    if (!storageAmount || storageAmount <= 0) {
        alert("Please enter a valid storage amount.");
        return;
    }

    // Find all depots that meet the storage requirement
    const suitableDepots = nodes.get().filter(node => node.capacity >= storageAmount);

    if (suitableDepots.length === 0) {
        document.getElementById("output").innerText = "No depots can accommodate the storage amount.";
        return;
    }

    // Run Dijkstra's algorithm to calculate distances from the source node
    const distances = {};
    suitableDepots.forEach(depot => {
        const result = dijkstra(graph, sourceNode, depot.id);
        distances[depot.id] = { distance: result.distance, path: result.path };
    });

    // Find the nearest depot
    let nearestDepot = null;
    let minDistance = Infinity;
    let shortestPath = [];

    for (let depot of suitableDepots) {
        if (distances[depot.id].distance < minDistance) {
            minDistance = distances[depot.id].distance;
            nearestDepot = depot;
            shortestPath = distances[depot.id].path;
        }
    }

    // Display result
    if (nearestDepot) {
        document.getElementById("output").innerText =
            `Nearest Depot: ${nearestDepot.label.split("\n")[0]} (Storage: ${nearestDepot.capacity}kg)\nDistance: ${minDistance}`;

        // Animate the path to the nearest depot
        animatePath(shortestPath);
    } else {
        document.getElementById("output").innerText = "No nearby depots found.";
    }
}

// Function to animate the path
function animatePath(path) {
    // Reset edge colors to default
    edges.update(edges.get().map(edge => ({ ...edge, color: '#848484' })));

    // Animate each segment of the path
    let previousNode = null;

    path.forEach((node, index) => {
        if (previousNode) {
            // Find the edge connecting previousNode and current node
            const edge = edges.get().find(e =>
                (e.from === previousNode && e.to === node) || (e.from === node && e.to === previousNode)
            );

            if (edge) {
                // Highlight the edge with a delay for animation
                setTimeout(() => {
                    edges.update({ id: edge.id, color: { color: 'green', highlight: 'green' } });
                }, index * 500); // 500ms delay for animation effect
            }
        }
        previousNode = node;
    });
}
// Function to find the shortest path with animation
function findShortestPath() {
    const source = document.getElementById("sourceNode").value.toUpperCase();
    const destination = document.getElementById("destinationNode").value.toUpperCase();

    // Validate the input
    if (!graph[source] || !graph[destination]) {
        alert("Invalid source or destination node! Use A-G.");
        return;
    }

    // Run Dijkstra's algorithm
    const result = dijkstra(graph, source, destination);

    if (result.distance === Infinity) {
        document.getElementById("output").innerText = "No path exists.";
    } else {
        document.getElementById("output").innerText =
            `Shortest Path: ${result.path.join(" -> ")}\nDistance: ${result.distance}`;
        
        // Animate the shortest path
        animatePath(result.path, 'red'); // Pass 'red' for shortest path color
    }
}

// Function to animate the path
function animatePath(path, color = 'Black') {
    // Reset edge colors to default
    edges.update(edges.get().map(edge => ({ ...edge, color: '#848484' })));

    // Animate each segment of the path
    let previousNode = null;

    path.forEach((node, index) => {
        if (previousNode) {
            // Find the edge connecting previousNode and current node
            const edge = edges.get().find(e =>
                (e.from === previousNode && e.to === node) || (e.from === node && e.to === previousNode)
            );

            if (edge) {
                // Highlight the edge with a delay for animation
                setTimeout(() => {
                    edges.update({ id: edge.id, color: { color: color, highlight: color } });
                }, index * 500); // 500ms delay for animation effect
            }
        }
        previousNode = node;
    });
}


