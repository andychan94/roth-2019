## Import the data

Import the Words from [https://tangorin.com/vocabulary](https://tangorin.com/vocabulary).

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

Manually create the radicals for the Kanjis which don't have.

```
MATCH (k:Kanji)
WHERE NOT (k)-[:HAS_RADICAL]->()
MATCH (r:Radical {value: k.value})
MERGE (k)-[:HAS_RADICAL]->(r)
RETURN r
```

## ALgos

### Jaccard

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

### PageRank

```
CALL algo.pageRank(
  "MATCH (k:Kanji) RETURN id(k) AS id",
  "MATCH (k1:Kanji)-[:HAS_READING]->()<-[:HAS_READING]-(k2:Kanji) RETURN id(k1) AS source, id(k2) AS target",
  {graph: "cypher", iterations: 5, write: true}
)
```

### Common Neighbors

```
MATCH (k1:Kanji {value: "生"}), (k2:Kanji) 
WHERE k1 <> k2
RETURN k1.value, k2.value, algo.linkprediction.commonNeighbors(k1, k2) AS score
ORDER BY score DESC
LIMIT 10
```

Cannot write property in the graph using this algorithm.
