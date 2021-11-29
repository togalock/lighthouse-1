Client will pass: 
{
  action: "TO_REQUEST_ROUTE",
  from: "6SN",
  color: "red",
  request: {
    "from_node": "N1",
    "to_node": "N2",
  }
}

Client will expect:
{
  action: "ROUTE_SET",
  to: "6SN",
}

Signage will expect:
{
  action: "SET_ROUTE",
  to: "N1",
  request: {
    cid: "6SN",
    color: "red",
    symbol: "arrow-left",
  }
}