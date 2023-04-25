import {is_subsumption} from "../RSPQLSubsumption";
describe('RSPQLSubsumption', () => {
    it("testing_subsumption_on_dahcc_queries", () => {
    let rspql_query_one = `
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
    let rspql_query_two = `
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
    expect(is_subsumption(rspql_query_one, rspql_query_two)).toBe(true);
    expect(is_subsumption(rspql_query_two, rspql_query_one)).toBe(false);
    })
});