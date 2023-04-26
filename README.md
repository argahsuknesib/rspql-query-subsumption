# RSPQL Query Subsumption

`This library is still in active development. Most of what's promised will not work, for now`

## Current Features.

- [x] - Checks the difference (without the blank nodes) between the basic graph patterns of two queries.
- [x] - If the difference array's length is more than 0, we conclude that query one subsumes the other.
- [] -  Improving the algorithm by additionally comparing the semantics of the difference array and if the variables present in the difference array are in the second query which is subsumed by it.

# Usage

Install the library with,

```bash
npm i rspql-query-subsumption
```
### Example Usage Code:
```typescript

import {is_subsumption} from 'rspql-query-subsumption'
let query_one = `
    PREFIX saref: <https://saref.etsi.org/core/> 
    PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
    PREFIX : <https://rsp.js/>
    REGISTER RStream <output> AS
    SELECT (AVG(?o) AS ?averageHR1)
    FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
    WHERE{
        WINDOW :w1 { ?s saref:hasValue ?o .
                    ?s saref:relatesToProperty dahccsensors:wearable.bvp .}
    }
    `
let query_two = `
    PREFIX saref: <https://saref.etsi.org/core/> 
    PREFIX dahccsensors: <https://dahcc.idlab.ugent.be/Homelab/SensorsAndActuators/>
    PREFIX : <https://rsp.js/>
    REGISTER RStream <output> AS
    SELECT (AVG(?o) AS ?averageHR1)
    FROM NAMED WINDOW :w1 ON STREAM <http://localhost:3000/dataset_participant1/data/> [RANGE 10 STEP 2]
    WHERE{
        WINDOW :w1 { ?s saref:hasValue ?o .
                    }
    }
    `

    is_subsumption(query_one, query_two); //returns true
    is_subsumption(query_two, query_one); //returns false
```

# License

This code is copyrighted by [Ghent University - imec](https://www.ugent.be/ea/idlab/en) and released under the [MIT Licence](./LICENCE)

