import Mock from "mockjs";

export default [
  {
    url: "/api/user/list",
    method: "get",
    response: () => {
      return {
        status: 1,
        result: Mock.mock({
          "list|5": [
            {
              id: "@id",
              guid: "@guid",
              name: "@name",
              cname: "@cname",
              age: "@integer(20, 50)",
              desc: "@cword(2, 5)",
              title: "@title(2, 5)",
              email: "@email",
              url: "@url",
              date: "@date",
              time: "@time",
              datetime: "@datetime",
              status: "@boolean",
            },
          ],
        }),
      };
    },
  },
];
