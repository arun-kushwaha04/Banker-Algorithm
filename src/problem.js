export const problem1 = {
    process: ["P0"],
    resource: ["A", "B", "C"],
    totalResources: [10, 5, 7],
    availableResources: [9, 5, 6],
    maxMatrix: {
        P0: [7, 5, 3],
    },
    allocationMatrix: {
        P0: [0, 1, 0],
    },
    needMatrix: {
        P0: [6, 5, 2],
    },
};

export const problem2 = {
    process: ["P0", "P1"],
    resource: ["A", "B", "C"],
    totalResources: [10, 5, 7],
    availableResources: [5, 4, 4],
    maxMatrix: {
        P0: [7, 5, 3],
        P1: [4, 5, 5],
    },
    allocationMatrix: {
        P0: [5, 1, 3],
        P1: [0, 0, 0],
    },
    needMatrix: {
        P0: [2, 4, 0],
        P1: [4, 5, 5],
    },
};

export const problem3 = {
    process: ["P0", "P1", "P2", "P3", "P4"],
    resource: ["A", "B", "C"],
    totalResources: [10, 5, 7],
    availableResources: [3, 3, 2],
    maxMatrix: {
        P0: [7, 5, 3],
        P1: [3, 2, 2],
        P2: [9, 0, 2],
        P3: [2, 2, 2],
        P4: [4, 3, 3],
    },
    allocationMatrix: {
        P0: [0, 1, 0],
        P1: [2, 0, 0],
        P2: [3, 0, 2],
        P3: [2, 1, 1],
        P4: [0, 0, 2],
    },
    needMatrix: {
        P0: [7, 4, 3],
        P1: [1, 2, 2],
        P2: [6, 0, 0],
        P3: [0, 1, 1],
        P4: [4, 3, 1],
    },
};
export const problem4 = {
    process: ["P0", "P1", "P2", "P3", "P4"],
    resource: ["A", "B", "C"],
    totalResources: [10, 5, 7],
    availableResources: [1, 1, 0],
    maxMatrix: {
        P0: [7, 5, 3],
        P1: [3, 2, 2],
        P2: [9, 0, 2],
        P3: [2, 2, 2],
        P4: [4, 3, 3],
    },
    allocationMatrix: {
        P0: [2, 3, 2],
        P1: [2, 0, 0],
        P2: [3, 0, 2],
        P3: [2, 1, 1],
        P4: [0, 0, 2],
    },
    needMatrix: {
        P0: [5, 2, 1],
        P1: [1, 2, 2],
        P2: [6, 0, 0],
        P3: [0, 1, 1],
        P4: [4, 3, 1],
    },
};
export const problem5 = {
    process: ["P0", "P1", "P2", "P3", "P4"],
    resource: ["A", "B", "C"],
    totalResources: [10, 5, 7],
    availableResources: [3, 3, 2],
    maxMatrix: {
        P0: [7, 5, 3],
        P1: [3, 2, 2],
        P2: [9, 0, 2],
        P3: [2, 2, 2],
        P4: [4, 3, 3],
    },
    allocationMatrix: {
        P0: [0, 1, 0],
        P1: [2, 0, 0],
        P2: [3, 0, 2],
        P3: [2, 1, 1],
        P4: [0, 0, 2],
    },
    needMatrix: {
        P0: [7, 4, 3],
        P1: [1, 2, 2],
        P2: [6, 0, 0],
        P3: [0, 1, 1],
        P4: [4, 3, 1],
    },
};