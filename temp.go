package main

import "fmt"

// Constants
const MaxDegree = 3
const MinDegree = MaxDegree / 2

// DataEntry stores a key-value pair
type DataEntry struct {
	key   int
	value string // For simplicity, we store a string value
}

// BTreeNode represents a single node in the B-Tree
type BTreeNode struct {
	entries    []DataEntry
	children   []*BTreeNode
	isLeaf     bool
	numEntries int
}

// BTree represents the entire B-Tree structure
type BTree struct {
	root *BTreeNode
}

// Search for a key within the B-Tree
func (tree *BTree) Search(key int) (string, bool) {
	node := tree.root
	for !node.isLeaf {
		index := findIndex(node.entries, key)
		if index < node.numEntries && node.entries[index].key == key {
			return node.entries[index].value, true
		}
		node = node.children[index]
	}

	index := findIndex(node.entries, key)
	if index < node.numEntries && node.entries[index].key == key {
		return node.entries[index].value, true
	}
	return "", false
}

// Insert a new data entry into the B-Tree
func (tree *BTree) Insert(entry DataEntry) {
	if tree.root == nil {
		tree.root = &BTreeNode{entries: []DataEntry{entry}, isLeaf: true, numEntries: 1}
		return
	}
	if tree.root.numEntries == 2*MaxDegree-1 {
		// Root is full, create a new root and split
		newRoot := &BTreeNode{children: []*BTreeNode{tree.root}, isLeaf: false, numEntries: 0}
		tree.root = newRoot
		splitChild(newRoot, 0, tree.root)
	}
	insertIntoNonFullNode(tree.root, entry)
}

// Helper function to find the correct index for insertion
func findIndex(entries []DataEntry, key int) int {
	i := 0
	for i < len(entries) && entries[i].key < key {
		i++
	}
	return i
}

// insertIntoNonFullNode inserts a key-value pair into a non-full B-Tree node
func insertIntoNonFullNode(node *BTreeNode, entry DataEntry) {
	index := findIndex(node.entries, entry.key)

	if node.isLeaf {
		// Simple insertion into a leaf node
		node.entries = append(node.entries, DataEntry{})   // Make space
		copy(node.entries[index+1:], node.entries[index:]) // Shift elements
		node.entries[index] = entry
		node.numEntries++
	} else {
		// Insertion into an internal node requires finding appropriate child node
		childIndex := index
		if index < node.numEntries && node.entries[index].key == entry.key {
			childIndex++
		}

		if node.children[childIndex].numEntries == 2*MaxDegree-1 {
			// Child node is full, split it first
			splitChild(node, childIndex, node.children[childIndex])
			if entry.key > node.entries[childIndex].key {
				childIndex++
			}
		}
		insertIntoNonFullNode(node.children[childIndex], entry)
	}
}

// splitChild splits a full child node of a parent node
func splitChild(parent *BTreeNode, index int, fullChild *BTreeNode) {
	// Create a new node
	newNode := &BTreeNode{isLeaf: fullChild.isLeaf, numEntries: MaxDegree - 1}

	// Split the entries of the full child node
	copy(newNode.entries, fullChild.entries[MaxDegree:])
	fullChild.numEntries = MaxDegree - 1

	// Split the children of the full child node, if present
	if !fullChild.isLeaf {
		copy(newNode.children, fullChild.children[MaxDegree:])
		fullChild.numEntries = MaxDegree - 1
	}

	// Insert the median key and the new node into the parent node
	parent.entries = append(parent.entries, DataEntry{}) // Make space
	copy(parent.entries[index+1:], parent.entries[index:])
	parent.entries[index] = fullChild.entries[MaxDegree-1]
	parent.numEntries++

	parent.children = append(parent.children, nil) // Make space
	copy(parent.children[index+2:], parent.children[index+1:])
	parent.children[index+1] = newNode
}

func main() {
	// Example usage
	tree := BTree{}
	tree.Insert(DataEntry{key: 5, value: "Data 5"})
	tree.Insert(DataEntry{key: 10, value: "Data 10"})
	tree.Insert(DataEntry{key: 2, value: "Data 2"})

	fmt.Println(tree.root)

	value, found := tree.Search(2)
	if found {
		fmt.Println("Value found:", value)
	}
}
