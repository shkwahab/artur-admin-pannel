import React from "react";

export default function MostUserEventsTbody({
  username,
  email,
  noOfEvents,
  key

}) {
  return (
    <tr key={key}>
      <td>{username}</td>
      <td>{email}</td>
      <td>{noOfEvents}</td>
    </tr>
  );
}
