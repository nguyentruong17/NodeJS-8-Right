"use strict";
const fs = require("fs");
const axios = require("axios");
const { program } = require("commander");
const pkg = require("./package.json");

// async function main() {

// }

// const handleResponse = async (promise) => {
//   try {
//     const res = await promise;
//   } catch (e) {}
// };

const fullUrl = (path = "") => {
  let url = `http://${program.opts().host}:${program.opts().port}/`;
  if (program.opts().index) {
    url += program.opts().index + "/";
    if (program.opts().type) {
      url += program.opts().type + "/";
    }
  }
  return url + path.replace(/^\/*/, "");
};

program
  .version(pkg.version)
  .description(pkg.description)
  .usage("[options] <command> [...]")
  .option("-o, --host <hostname>", "hostname [localhost]", "localhost")
  .option("-p, --port <number>", "port number [9200]", "9200")
  .option("-j, --json", "format output as JSON")
  .option("-i, --index <name>", "which index to use")
  .option("-t, --type <type>", "default type for bulk operations")
  .option('-f, --filter <filter>', 'source filter for query results');

program
  .command("url [path]")
  .description("generate the URL for the options and path (default is /)")
  .action((path = "/") => console.log(fullUrl(path)));
program
  .command("get [path]")
  .description("perform an HTTP GET request for path (default is /)")
  .action(async (path = "/") => {
    const options = {
      url: fullUrl(path),
      json: program.opts().json,
    };
    //needs refactoring
    try {
      const res = await axios(options);
      if (program.opts().json) {
        console.log(JSON.stringify(res.data));
      } else {
        console.log(res.data);
      }
    } catch (e) {
      if (program.opts().json) {
        console.log(JSON.stringify(e));
      } else {
        throw e;
      }
    }
  });

program
  .command("create-index")
  .description("create an index")
  .action(async () => {
    if (!program.opts().index) {
      const msg = "No index specified! Use --index <name>";
      if (!program.opts().json) throw Error(msg);
      console.log(JSON.stringify({ error: msg }));
      return;
    }
    //needs refactoring
    try {
      const res = await axios.put(fullUrl());
      if (program.opts().json) {
        console.log(JSON.stringify(res.data));
      } else {
        console.log(res.data);
      }
    } catch (e) {
      if (program.opts().json) {
        console.log(JSON.stringify(e));
      } else {
        throw e;
      }
    }
  });

program
  .command("list-indices")
  .alias("li")
  .description("get a list of indices in this cluster")
  .action(async () => {
    const path = program.opts().json ? "_all" : "_cat/indices?v";
    const options = {
      url: fullUrl(path),
      json: program.opts().json,
    };
    //needs refactoring
    try {
      const res = await axios(options);
      if (program.opts().json) {
        console.log(JSON.stringify(res.data));
      } else {
        console.log(res.data);
      }
    } catch (e) {
      if (program.opts().json) {
        console.log(JSON.stringify(e));
      } else {
        throw e;
      }
    }
  });
program
  .command("bulk <file>")
  .description("read and perform bulk options from the specified file")
  .action((file) => {
    fs.stat(file, async (err, stats) => {
      if (err) {
        if (program.opts().json) {
          console.log(JSON.stringify(err));
          return;
        }
        throw err;
      }

      const stream = fs.createReadStream(file);
      const options = {
        method: "POST",
        url: fullUrl("_bulk"),
        json: true,
        headers: {
          "content-length": stats.size,
          "content-type": "application/json",
        },
        maxBodyLength: 20 * 1024 * 1024,
        data: stream,
      };
      //needs refactoring
      try {
        const req = await axios(options);
        req.pipe(process.stdout); //doesnt seem to pipe - needs further research
      } catch (e) {}
    });
  });

program
  .command("query [queries...]")
  .description("perform an Elasticsearch query")
  .action(async (queries = []) => {
    const options = {
      url: fullUrl("_search"),
      json: program.opts().json,
      qs: {}, 
      //?q=Mark%20Twain&_source=title
      //?q=authors:Mark%20Twain%20AND%20subjects:drama&_source=title,authors
    };
    if (queries && queries.length) {
      options.qs.q = queries.join(" ");
    }
    if (program.opts().filter) {
      options.qs._source = program.opts().filter;
    }
    
    //needs refactoring
    try {
      const res = await axios(options);
      if (program.opts().json) {
        console.log(JSON.stringify(res.data));
      } else {
        console.log(res.data);
      }
    } catch (e) {
      if (program.opts().json) {
        console.log(JSON.stringify(e));
      } else {
        throw e;
      }
    }
  });

// try {
//   main();
// } catch (e) {
//   console.log(e);
// }
program.parseAsync(process.argv);
//program.parse(process.argv);

//// This is causing trouble to async action handler
// if (!program.args.filter((arg) => typeof arg === "object").length) {
//   console.log("Here");
//   program.help();
// }
