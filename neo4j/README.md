## Setup

1. Import the kanjis data
2. Import the radical data
3. Run PageRank algorithm to compute kanjis score
4. Run Jaccard algorithm to compute kanjis similarity

### Import the Kanjis data

Import the data from [https://tangorin.com/vocabulary](https://tangorin.com/vocabulary).

```
UNWIND ["5", "4", "3", "2", "1"] AS level
LOAD CSV FROM "https://raw.githubusercontent.com/andychan94/roth-2019/master/neo4j/data/vocabulary_6501" + level + ".csv" AS row
MERGE (k:Kanji {value: row[0]})

WITH row, k, level
MERGE (l:Level {value: "N" + level})
WITH row, k, l
MERGE (k)-[:HAS_LEVEL]-(l)

WITH row, k
UNWIND split(row[1], "・") AS reading
MERGE (r:Reading {value: reading})
WITH row, k, r
MERGE (k)-[:HAS_READING]->(r)

WITH row, k
UNWIND split(row[2], "; ") AS meaning
MERGE (m:Meaning {value: meaning})
WITH row, k, m
MERGE (k)-[:HAS_MEANING]->(m)
```

### Import the radical data

Import the radical data from Rikaichan.

```
LOAD CSV WITH HEADERS FROM "https://raw.githubusercontent.com/andychan94/roth-2019/master/neo4j/data/radicals.csv" AS row
UNWIND split(row.kanjiList, "") AS kanji
MATCH (k:Kanji {value: kanji})
WITH row, k
MERGE (r:Radical {value: row.radical})
WITH k, r
MERGE (k)-[:HAS_RADICAL]->(r)
RETURN k, r
```

Manually create the radicals for the Kanjis which don't have any.

```
MATCH (k:Kanji)
WHERE NOT (k)-[:HAS_RADICAL]->()
MATCH (r:Radical {value: k.value})
MERGE (k)-[:HAS_RADICAL]->(r)
RETURN r
```

### Run PageRank algorithm to compute kanjis score

First, we need to create SIMILAR relationships using Jaccard algorithm.

```
MATCH (k:Kanji)-[]->(n)
WITH {item: id(k), categories: collect(id(n))} AS userData
WITH collect(userData) AS data
CALL algo.similarity.jaccard(data, {topK: 50, similarityCutoff: 0.1, write:true, writeProperty: "jaccardSimilarity"})
YIELD nodes, similarityPairs, write, writeRelationshipType, writeProperty
RETURN nodes, similarityPairs, write, writeRelationshipType, writeProperty
```

Then, we run the PageRank algorithm.

```
CALL algo.pageRank('Kanji', 'SIMILAR', {iterations:20, dampingFactor:0.85, weightProperty: "jaccardSimilarity"})
YIELD nodes, iterations, loadMillis, computeMillis, writeMillis, dampingFactor, write, writeProperty
RETURN nodes, iterations, loadMillis, computeMillis, writeMillis, dampingFactor, write, writeProperty
```

We update the pagerank score to be funnier.

```
MATCH (k:Kanji)
SET k.pagerank = round(k.pagerank * 100)
```

Finally, we clea the SIMILAR relationships.

```
MATCH ()-[r:SIMILAR]->() DELETE r
```

### Run Jaccard algorithm to compute kanjis similarity

```
MATCH (k:Kanji)-[]->(n)
WITH {item: id(k), categories: collect(id(n))} AS userData
WITH collect(userData) AS data
CALL algo.similarity.jaccard(data, {topK: 3, similarityCutoff: 0.1, write:true, writeProperty: "jaccardSimilarity"})
YIELD nodes, similarityPairs, write, writeRelationshipType, writeProperty
RETURN nodes, similarityPairs, write, writeRelationshipType, writeProperty
```

## Users queries

Fetch users scoreboard.

```
MATCH (u:User) 
RETURN u.name AS name, u.score AS score
ORDER BY score DESC
```

Delete users

```
MATCH (u:User) 
DETACH DELETE u
```


## Other queries

### Sample similarity from one kanji (this will not update the DB)

```
MATCH (k:Kanji {value: "家"})-[]->(n)
WITH k, collect(id(n)) AS links

MATCH (k2:Kanji)-[]->(n)
WHERE k <> k2
WITH k, links, k2, collect(id(n)) AS links2

RETURN k.value, k2.value, algo.similarity.jaccard(links, links2) AS similarity
ORDER BY similarity DESC
LIMIT 10
```

### Common Neighbors

```
MATCH (k1:Kanji {value: "生"}), (k2:Kanji) 
WHERE k1 <> k2
RETURN k1.value, k2.value, algo.linkprediction.commonNeighbors(k1, k2) AS score
ORDER BY score DESC
LIMIT 10
```


