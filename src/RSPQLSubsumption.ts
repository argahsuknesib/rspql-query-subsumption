import { ParsedQuery } from "./parsers/ParsedQuery";
import { parse } from "./parsers/RSPQLParser";
import * as RDF from "@rdfjs/types";
import { DataFactory, Quad } from "rdf-data-factory";
import { getGraphBlankNodes, getQuadsWithBlankNodes, hashTerms, ITermHash, uniqGraph } from "rdf-isomorphic";
import { everyTerms } from 'rdf-terms';
import { quadToStringQuad } from "rdf-string";
const sparqlParser = require('sparqljs').Parser;
const sparql_parser = new sparqlParser();

export function is_subsumption(query_one: string, query_two: string): boolean {
    if (check_rsp_parameters(query_one, query_two)) {
        return check_bgp_subsumption_condition(get_bgp_from_rspql(query_one), get_bgp_from_rspql(query_two))
    }
    else {
        return false;
    }
}

function check_rsp_parameters(query_one: string, query_two: string) {
    let query_one_parsed = parse(query_one);
    let query_two_parsed = parse(query_two);
    return (check_if_stream_parameters_are_equal(query_one_parsed, query_two_parsed) && check_if_window_name_are_equal(query_one_parsed, query_two_parsed)) ? true : false;
}

function check_bgp_subsumption_condition(query_bgp_one: Quad[], query_bgp_two: Quad[]) {
    return compare_bgp_subsets(query_bgp_one, query_bgp_two);
}

export function get_bgp_from_rspql(query: string): Quad[] {
    let query_parsed: ParsedQuery = parse(query);
    let query_bgp: Quad[] = generate_bgp_quads_from_query(query_parsed.sparql);
    return query_bgp;
}

function quadArrayToString<Q extends RDF.BaseQuad = RDF.Quad>(quadArray: Q[]): string {
    return '[\n' + quadArray.map((quad) => '  ' + JSON.stringify(quadToStringQuad(quad))).join(',\n') + '\n]';
}

function compare_bgp_subsets(query_bgp_one: Quad[], query_bgp_two: Quad[]): boolean {
    let difference_between_graphs = getNonBlankDiff(query_bgp_one, query_bgp_two);
    return (difference_between_graphs.length > 0) ? true : false;
}

function getNonBlankDiff<Q extends RDF.BaseQuad = RDF.Quad>(a1: Q[], a2: Q[]) {
    return a1.filter(
        quad =>
            everyTerms(quad, term => term.termType !== 'BlankNode')
            && a2.every(q2 => !q2.equals(quad))
    )
}

export function getDiff(hash1: ITermHash, hash2: ITermHash) {
    const diffed: string[] = [];
    const values = new Set(Object.values(hash2));
    for (const key in hash1) {
        if (!values.has(hash1[key])) {
            diffed.push(key);
        }
    }
    return diffed;
}

function check_if_stream_parameters_are_equal(query_one_parsed: ParsedQuery, query_two_parsed: ParsedQuery) {
    return (query_one_parsed.s2r[0].stream_name === query_two_parsed.s2r[0].stream_name && query_one_parsed.s2r[0].width === query_two_parsed.s2r[0].width && query_one_parsed.s2r[0].slide === query_two_parsed.s2r[0].slide) ? true : false;
}

function check_if_window_name_are_equal(query_one_parsed: ParsedQuery, query_two_parsed: ParsedQuery) {
    return (query_one_parsed.s2r[0].window_name === query_two_parsed.s2r[0].window_name) ? true : false;
}

function generate_bgp_quads_from_query(query: string): Quad[] {
    let sparql_parsed = sparql_parser.parse(query);
    let basic_graph_pattern = sparql_parsed.where[0].patterns[0].triples;
    let graph = convert_to_graph(basic_graph_pattern);
    return graph;
}
function convert_to_graph(basic_graph_pattern: any): Quad[] {
    let graph: Quad[] = [];
    for (let i = 0; i < basic_graph_pattern.length; i++) {
        let subject = basic_graph_pattern[i].subject;
        let predicate = basic_graph_pattern[i].predicate;
        let object = basic_graph_pattern[i].object;
        let quad = new DataFactory().quad(subject, predicate, object);
        graph.push(quad);
    }
    return graph;
}

export function unGroundHashes<Q extends RDF.BaseQuad = RDF.Quad>(graph: Q[]) {
    return hashTerms(uniqGraph(getQuadsWithBlankNodes(graph)), getGraphBlankNodes(graph), {})[1]
}


