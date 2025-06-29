// GENERATED by @gel/generate v0.6.3

import * as $ from "../../../reflection";
import * as _ from "../../../imports";
import type * as _std from "../../std";
import type * as _stdnet from "../net";
export type $Method = {
  "GET": $.$expr_Literal<$Method>;
  "POST": $.$expr_Literal<$Method>;
  "PUT": $.$expr_Literal<$Method>;
  "DELETE": $.$expr_Literal<$Method>;
  "HEAD": $.$expr_Literal<$Method>;
  "OPTIONS": $.$expr_Literal<$Method>;
  "PATCH": $.$expr_Literal<$Method>;
} & $.EnumType<"std::net::http::Method", ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"]>;
const Method: $Method = $.makeType<$Method>(_.spec, "8896d50c-81c2-5d7d-bb2f-cb2bfba3c628", _.syntax.literal);

export type $ResponseλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
  "created_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
  "status": $.PropertyDesc<_std.$int16, $.Cardinality.AtMostOne, false, false, false, false>;
  "headers": $.PropertyDesc<$.ArrayType<$.NamedTupleType<{name: _std.$str, value: _std.$str}>>, $.Cardinality.AtMostOne, false, false, false, false>;
  "body": $.PropertyDesc<_std.$bytes, $.Cardinality.AtMostOne, false, false, false, false>;
  "request": $.LinkDesc<$ScheduledRequest, $.Cardinality.AtMostOne, {}, false, true,  false, false>;
  "<response[is std::net::http::ScheduledRequest]": $.LinkDesc<$ScheduledRequest, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<response": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $Response = $.ObjectType<"std::net::http::Response", $ResponseλShape, null, [
  ..._std.$BaseObject['__exclusives__'],
], "std::net::http::Response">;
const $Response = $.makeType<$Response>(_.spec, "6f217eab-7720-5bbc-8b1f-b02098bc9a4e", _.syntax.literal);

const Response: $.$expr_PathNode<$.TypeSet<$Response, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($Response, $.Cardinality.Many), null);

export type $ScheduledRequestλShape = $.typeutil.flatten<_std.$BaseObjectλShape & {
  "state": $.PropertyDesc<_stdnet.$RequestState, $.Cardinality.One, false, false, false, false>;
  "created_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
  "updated_at": $.PropertyDesc<_std.$datetime, $.Cardinality.One, false, false, false, false>;
  "failure": $.PropertyDesc<$.NamedTupleType<{kind: _stdnet.$RequestFailureKind, message: _std.$str}>, $.Cardinality.AtMostOne, false, false, false, false>;
  "url": $.PropertyDesc<_std.$str, $.Cardinality.One, false, false, false, false>;
  "method": $.PropertyDesc<$Method, $.Cardinality.One, false, false, false, false>;
  "headers": $.PropertyDesc<$.ArrayType<$.NamedTupleType<{name: _std.$str, value: _std.$str}>>, $.Cardinality.AtMostOne, false, false, false, false>;
  "body": $.PropertyDesc<_std.$bytes, $.Cardinality.AtMostOne, false, false, false, false>;
  "response": $.LinkDesc<$Response, $.Cardinality.AtMostOne, {}, true, false,  false, false>;
  "<request[is std::net::http::Response]": $.LinkDesc<$Response, $.Cardinality.Many, {}, false, false,  false, false>;
  "<request": $.LinkDesc<$.ObjectType, $.Cardinality.Many, {}, false, false,  false, false>;
}>;
type $ScheduledRequest = $.ObjectType<"std::net::http::ScheduledRequest", $ScheduledRequestλShape, null, [
  ..._std.$BaseObject['__exclusives__'],
  {response: {__element__: $Response, __cardinality__: $.Cardinality.One | $.Cardinality.AtMostOne },},
], "std::net::http::ScheduledRequest">;
const $ScheduledRequest = $.makeType<$ScheduledRequest>(_.spec, "e6bf05a7-60c7-51dd-b30d-c8fce5bcadfd", _.syntax.literal);

const ScheduledRequest: $.$expr_PathNode<$.TypeSet<$ScheduledRequest, $.Cardinality.Many>, null> = _.syntax.$PathNode($.$toSet($ScheduledRequest, $.Cardinality.Many), null);

type schedule_requestλFuncExpr<
  NamedArgs extends {
    "body"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
    "headers"?: $.TypeSet<$.ArrayType<$.NamedTupleType<{name: _std.$str, value: _std.$str}>>>,
    "method"?: _.castMaps.orScalarLiteral<$.TypeSet<$Method>>,
  },
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
> = $.$expr_Function<
  $ScheduledRequest, $.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.multiplyCardinalities<$.cardutil.paramCardinality<P1>, $.cardutil.optionalParamCardinality<NamedArgs["body"]>>, $.cardutil.optionalParamCardinality<NamedArgs["headers"]>>, $.cardutil.optionalParamCardinality<NamedArgs["method"]>>
>;
type schedule_requestλFuncExpr2<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
> = $.$expr_Function<
  $ScheduledRequest, $.cardutil.paramCardinality<P1>
>;
function schedule_request<
  NamedArgs extends {
    "body"?: _.castMaps.orScalarLiteral<$.TypeSet<_std.$bytes>>,
    "headers"?: $.TypeSet<$.ArrayType<$.NamedTupleType<{name: _std.$str, value: _std.$str}>>>,
    "method"?: _.castMaps.orScalarLiteral<$.TypeSet<$Method>>,
  },
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  namedArgs: NamedArgs,
  url: P1,
): schedule_requestλFuncExpr<NamedArgs, P1>;
function schedule_request<
  P1 extends _.castMaps.orScalarLiteral<$.TypeSet<_std.$str>>,
>(
  url: P1,
): schedule_requestλFuncExpr2<P1>;
function schedule_request(...args: any[]) {
  const {returnType, cardinality, args: positionalArgs, namedArgs} = _.syntax.$resolveOverload('std::net::http::schedule_request', args, _.spec, [
    {args: [{typeId: "00000000-0000-0000-0000-000000000101", optional: false, setoftype: false, variadic: false}], namedArgs: {"body": {typeId: "00000000-0000-0000-0000-000000000102", optional: true, setoftype: false, variadic: false}, "headers": {typeId: "29b1b6f1-a0e0-577d-adcf-e493f6b2303a", optional: true, setoftype: false, variadic: false}, "method": {typeId: "8896d50c-81c2-5d7d-bb2f-cb2bfba3c628", optional: true, setoftype: false, variadic: false}}, returnTypeId: "e6bf05a7-60c7-51dd-b30d-c8fce5bcadfd"},
  ]);
  return _.syntax.$expressionify({
    __kind__: $.ExpressionKind.Function,
    __element__: returnType,
    __cardinality__: cardinality,
    __name__: "std::net::http::schedule_request",
    __args__: positionalArgs,
    __namedargs__: namedArgs,
  }) as any;
};



export { Method, $Response, Response, $ScheduledRequest, ScheduledRequest };

type __defaultExports = {
  "Method": typeof Method;
  "Response": typeof Response;
  "ScheduledRequest": typeof ScheduledRequest;
  "schedule_request": typeof schedule_request
};
const __defaultExports: __defaultExports = {
  "Method": Method,
  "Response": Response,
  "ScheduledRequest": ScheduledRequest,
  "schedule_request": schedule_request
};
export default __defaultExports;
