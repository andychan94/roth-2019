## Import the data

```
UNWIND ["5", "4", "3", "2", "1"] AS level
LOAD CSV FROM "https://github.com/andychan94/roth-2019/blob/master/neo4j/vocabulary_6501" + level + ".csv" AS row
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
