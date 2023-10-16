import React from "react";

export default function MostUserEventsTbody({
  username,
  email,
  noOfEvents,
  key

}) {
  return (
    <tr key={key}>
      <td className=" font-normal">{username}</td>
      <td className=" font-normal">{email}</td>
      <td className=" font-normal">{noOfEvents}</td>
    </tr>
  );
}
