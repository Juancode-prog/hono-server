// @bun
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/@redis/client/dist/lib/commands/APPEND.js
var require_APPEND = __commonJS((exports) => {
  function transformArguments(key, value) {
    return ["APPEND", key, value];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BITCOUNT.js
var require_BITCOUNT = __commonJS((exports) => {
  function transformArguments(key, range) {
    const args = ["BITCOUNT", key];
    if (range) {
      args.push(range.start.toString(), range.end.toString());
      if (range.mode) {
        args.push(range.mode);
      }
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BITFIELD_RO.js
var require_BITFIELD_RO = __commonJS((exports) => {
  function transformArguments(key, operations) {
    const args = ["BITFIELD_RO", key];
    for (const operation of operations) {
      args.push("GET", operation.encoding, operation.offset.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BITFIELD.js
var require_BITFIELD = __commonJS((exports) => {
  function transformArguments(key, operations) {
    const args = ["BITFIELD", key];
    for (const options of operations) {
      switch (options.operation) {
        case "GET":
          args.push("GET", options.encoding, options.offset.toString());
          break;
        case "SET":
          args.push("SET", options.encoding, options.offset.toString(), options.value.toString());
          break;
        case "INCRBY":
          args.push("INCRBY", options.encoding, options.offset.toString(), options.increment.toString());
          break;
        case "OVERFLOW":
          args.push("OVERFLOW", options.behavior);
          break;
      }
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/generic-transformers.js
var require_generic_transformers = __commonJS((exports) => {
  function transformBooleanReply(reply) {
    return reply === 1;
  }
  function transformBooleanArrayReply(reply) {
    return reply.map(transformBooleanReply);
  }
  function pushScanArguments(args, cursor, options) {
    args.push(cursor.toString());
    if (options?.MATCH) {
      args.push("MATCH", options.MATCH);
    }
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  function transformNumberInfinityReply(reply) {
    switch (reply.toString()) {
      case "+inf":
        return Infinity;
      case "-inf":
        return -Infinity;
      default:
        return Number(reply);
    }
  }
  function transformNumberInfinityNullReply(reply) {
    if (reply === null)
      return null;
    return transformNumberInfinityReply(reply);
  }
  function transformNumberInfinityNullArrayReply(reply) {
    return reply.map(transformNumberInfinityNullReply);
  }
  function transformNumberInfinityArgument(num) {
    switch (num) {
      case Infinity:
        return "+inf";
      case -Infinity:
        return "-inf";
      default:
        return num.toString();
    }
  }
  function transformStringNumberInfinityArgument(num) {
    if (typeof num !== "number")
      return num;
    return transformNumberInfinityArgument(num);
  }
  function transformTuplesReply(reply) {
    const message = Object.create(null);
    for (let i = 0;i < reply.length; i += 2) {
      message[reply[i].toString()] = reply[i + 1];
    }
    return message;
  }
  function transformStreamMessageReply([id, message]) {
    return {
      id,
      message: transformTuplesReply(message)
    };
  }
  function transformStreamMessageNullReply(reply) {
    if (reply === null)
      return null;
    return transformStreamMessageReply(reply);
  }
  function transformStreamMessagesReply(reply) {
    return reply.map(transformStreamMessageReply);
  }
  function transformStreamMessagesNullReply(reply) {
    return reply.map(transformStreamMessageNullReply);
  }
  function transformStreamsMessagesReply(reply) {
    if (reply === null)
      return null;
    return reply.map(([name, rawMessages]) => ({
      name,
      messages: transformStreamMessagesReply(rawMessages)
    }));
  }
  function transformSortedSetMemberNullReply(reply) {
    if (!reply.length)
      return null;
    return transformSortedSetMemberReply(reply);
  }
  function transformSortedSetMemberReply(reply) {
    return {
      value: reply[0],
      score: transformNumberInfinityReply(reply[1])
    };
  }
  function transformSortedSetWithScoresReply(reply) {
    const members = [];
    for (let i = 0;i < reply.length; i += 2) {
      members.push({
        value: reply[i],
        score: transformNumberInfinityReply(reply[i + 1])
      });
    }
    return members;
  }
  function transformZMPopArguments(args, keys, side, options) {
    pushVerdictArgument(args, keys);
    args.push(side);
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  function transformLMPopArguments(args, keys, side, options) {
    pushVerdictArgument(args, keys);
    args.push(side);
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  function pushGeoCountArgument(args, count) {
    if (typeof count === "number") {
      args.push("COUNT", count.toString());
    } else if (count) {
      args.push("COUNT", count.value.toString());
      if (count.ANY) {
        args.push("ANY");
      }
    }
    return args;
  }
  function pushGeoSearchArguments(args, key, from, by, options) {
    args.push(key);
    if (typeof from === "string") {
      args.push("FROMMEMBER", from);
    } else {
      args.push("FROMLONLAT", from.longitude.toString(), from.latitude.toString());
    }
    if ("radius" in by) {
      args.push("BYRADIUS", by.radius.toString());
    } else {
      args.push("BYBOX", by.width.toString(), by.height.toString());
    }
    args.push(by.unit);
    if (options?.SORT) {
      args.push(options.SORT);
    }
    pushGeoCountArgument(args, options?.COUNT);
    return args;
  }
  function pushGeoRadiusArguments(args, key, from, radius, unit, options) {
    args.push(key);
    if (typeof from === "string") {
      args.push(from);
    } else {
      args.push(from.longitude.toString(), from.latitude.toString());
    }
    args.push(radius.toString(), unit);
    if (options?.SORT) {
      args.push(options.SORT);
    }
    pushGeoCountArgument(args, options?.COUNT);
    return args;
  }
  function pushGeoRadiusStoreArguments(args, key, from, radius, unit, destination, options) {
    pushGeoRadiusArguments(args, key, from, radius, unit, options);
    if (options?.STOREDIST) {
      args.push("STOREDIST", destination);
    } else {
      args.push("STORE", destination);
    }
    return args;
  }
  function transformGeoMembersWithReply(reply, replyWith) {
    const replyWithSet = new Set(replyWith);
    let index = 0;
    const distanceIndex = replyWithSet.has(GeoReplyWith.DISTANCE) && ++index, hashIndex = replyWithSet.has(GeoReplyWith.HASH) && ++index, coordinatesIndex = replyWithSet.has(GeoReplyWith.COORDINATES) && ++index;
    return reply.map((member) => {
      const transformedMember = {
        member: member[0]
      };
      if (distanceIndex) {
        transformedMember.distance = member[distanceIndex];
      }
      if (hashIndex) {
        transformedMember.hash = member[hashIndex];
      }
      if (coordinatesIndex) {
        const [longitude, latitude] = member[coordinatesIndex];
        transformedMember.coordinates = {
          longitude,
          latitude
        };
      }
      return transformedMember;
    });
  }
  function transformEXAT(EXAT) {
    return (typeof EXAT === "number" ? EXAT : Math.floor(EXAT.getTime() / 1000)).toString();
  }
  function transformPXAT(PXAT) {
    return (typeof PXAT === "number" ? PXAT : PXAT.getTime()).toString();
  }
  function evalFirstKeyIndex(options) {
    return options?.keys?.[0];
  }
  function pushEvalArguments(args, options) {
    if (options?.keys) {
      args.push(options.keys.length.toString(), ...options.keys);
    } else {
      args.push("0");
    }
    if (options?.arguments) {
      args.push(...options.arguments);
    }
    return args;
  }
  function pushVerdictArguments(args, value) {
    if (Array.isArray(value)) {
      args = args.concat(value);
    } else {
      args.push(value);
    }
    return args;
  }
  function pushVerdictNumberArguments(args, value) {
    if (Array.isArray(value)) {
      for (const item of value) {
        args.push(item.toString());
      }
    } else {
      args.push(value.toString());
    }
    return args;
  }
  function pushVerdictArgument(args, value) {
    if (Array.isArray(value)) {
      args.push(value.length.toString(), ...value);
    } else {
      args.push("1", value);
    }
    return args;
  }
  function pushOptionalVerdictArgument(args, name, value) {
    if (value === undefined)
      return args;
    args.push(name);
    return pushVerdictArgument(args, value);
  }
  function transformCommandReply([name, arity, flags, firstKeyIndex, lastKeyIndex, step, categories]) {
    return {
      name,
      arity,
      flags: new Set(flags),
      firstKeyIndex,
      lastKeyIndex,
      step,
      categories: new Set(categories)
    };
  }
  function transformFunctionListItemReply(reply) {
    return {
      libraryName: reply[1],
      engine: reply[3],
      functions: reply[5].map((fn) => ({
        name: fn[1],
        description: fn[3],
        flags: fn[5]
      }))
    };
  }
  function pushSortArguments(args, options) {
    if (options?.BY) {
      args.push("BY", options.BY);
    }
    if (options?.LIMIT) {
      args.push("LIMIT", options.LIMIT.offset.toString(), options.LIMIT.count.toString());
    }
    if (options?.GET) {
      for (const pattern of typeof options.GET === "string" ? [options.GET] : options.GET) {
        args.push("GET", pattern);
      }
    }
    if (options?.DIRECTION) {
      args.push(options.DIRECTION);
    }
    if (options?.ALPHA) {
      args.push("ALPHA");
    }
    return args;
  }
  function pushSlotRangeArguments(args, range) {
    args.push(range.start.toString(), range.end.toString());
  }
  function pushSlotRangesArguments(args, ranges) {
    if (Array.isArray(ranges)) {
      for (const range of ranges) {
        pushSlotRangeArguments(args, range);
      }
    } else {
      pushSlotRangeArguments(args, ranges);
    }
    return args;
  }
  function transformRangeReply([start, end]) {
    return {
      start,
      end
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformRangeReply = exports.pushSlotRangesArguments = exports.pushSortArguments = exports.transformFunctionListItemReply = exports.RedisFunctionFlags = exports.transformCommandReply = exports.CommandCategories = exports.CommandFlags = exports.pushOptionalVerdictArgument = exports.pushVerdictArgument = exports.pushVerdictNumberArguments = exports.pushVerdictArguments = exports.pushEvalArguments = exports.evalFirstKeyIndex = exports.transformPXAT = exports.transformEXAT = exports.transformGeoMembersWithReply = exports.GeoReplyWith = exports.pushGeoRadiusStoreArguments = exports.pushGeoRadiusArguments = exports.pushGeoSearchArguments = exports.pushGeoCountArgument = exports.transformLMPopArguments = exports.transformZMPopArguments = exports.transformSortedSetWithScoresReply = exports.transformSortedSetMemberReply = exports.transformSortedSetMemberNullReply = exports.transformStreamsMessagesReply = exports.transformStreamMessagesNullReply = exports.transformStreamMessagesReply = exports.transformStreamMessageNullReply = exports.transformStreamMessageReply = exports.transformTuplesReply = exports.transformStringNumberInfinityArgument = exports.transformNumberInfinityArgument = exports.transformNumberInfinityNullArrayReply = exports.transformNumberInfinityNullReply = exports.transformNumberInfinityReply = exports.pushScanArguments = exports.transformBooleanArrayReply = exports.transformBooleanReply = undefined;
  exports.transformBooleanReply = transformBooleanReply;
  exports.transformBooleanArrayReply = transformBooleanArrayReply;
  exports.pushScanArguments = pushScanArguments;
  exports.transformNumberInfinityReply = transformNumberInfinityReply;
  exports.transformNumberInfinityNullReply = transformNumberInfinityNullReply;
  exports.transformNumberInfinityNullArrayReply = transformNumberInfinityNullArrayReply;
  exports.transformNumberInfinityArgument = transformNumberInfinityArgument;
  exports.transformStringNumberInfinityArgument = transformStringNumberInfinityArgument;
  exports.transformTuplesReply = transformTuplesReply;
  exports.transformStreamMessageReply = transformStreamMessageReply;
  exports.transformStreamMessageNullReply = transformStreamMessageNullReply;
  exports.transformStreamMessagesReply = transformStreamMessagesReply;
  exports.transformStreamMessagesNullReply = transformStreamMessagesNullReply;
  exports.transformStreamsMessagesReply = transformStreamsMessagesReply;
  exports.transformSortedSetMemberNullReply = transformSortedSetMemberNullReply;
  exports.transformSortedSetMemberReply = transformSortedSetMemberReply;
  exports.transformSortedSetWithScoresReply = transformSortedSetWithScoresReply;
  exports.transformZMPopArguments = transformZMPopArguments;
  exports.transformLMPopArguments = transformLMPopArguments;
  exports.pushGeoCountArgument = pushGeoCountArgument;
  exports.pushGeoSearchArguments = pushGeoSearchArguments;
  exports.pushGeoRadiusArguments = pushGeoRadiusArguments;
  exports.pushGeoRadiusStoreArguments = pushGeoRadiusStoreArguments;
  var GeoReplyWith;
  (function(GeoReplyWith2) {
    GeoReplyWith2["DISTANCE"] = "WITHDIST";
    GeoReplyWith2["HASH"] = "WITHHASH";
    GeoReplyWith2["COORDINATES"] = "WITHCOORD";
  })(GeoReplyWith || (exports.GeoReplyWith = GeoReplyWith = {}));
  exports.transformGeoMembersWithReply = transformGeoMembersWithReply;
  exports.transformEXAT = transformEXAT;
  exports.transformPXAT = transformPXAT;
  exports.evalFirstKeyIndex = evalFirstKeyIndex;
  exports.pushEvalArguments = pushEvalArguments;
  exports.pushVerdictArguments = pushVerdictArguments;
  exports.pushVerdictNumberArguments = pushVerdictNumberArguments;
  exports.pushVerdictArgument = pushVerdictArgument;
  exports.pushOptionalVerdictArgument = pushOptionalVerdictArgument;
  var CommandFlags;
  (function(CommandFlags2) {
    CommandFlags2["WRITE"] = "write";
    CommandFlags2["READONLY"] = "readonly";
    CommandFlags2["DENYOOM"] = "denyoom";
    CommandFlags2["ADMIN"] = "admin";
    CommandFlags2["PUBSUB"] = "pubsub";
    CommandFlags2["NOSCRIPT"] = "noscript";
    CommandFlags2["RANDOM"] = "random";
    CommandFlags2["SORT_FOR_SCRIPT"] = "sort_for_script";
    CommandFlags2["LOADING"] = "loading";
    CommandFlags2["STALE"] = "stale";
    CommandFlags2["SKIP_MONITOR"] = "skip_monitor";
    CommandFlags2["ASKING"] = "asking";
    CommandFlags2["FAST"] = "fast";
    CommandFlags2["MOVABLEKEYS"] = "movablekeys";
  })(CommandFlags || (exports.CommandFlags = CommandFlags = {}));
  var CommandCategories;
  (function(CommandCategories2) {
    CommandCategories2["KEYSPACE"] = "@keyspace";
    CommandCategories2["READ"] = "@read";
    CommandCategories2["WRITE"] = "@write";
    CommandCategories2["SET"] = "@set";
    CommandCategories2["SORTEDSET"] = "@sortedset";
    CommandCategories2["LIST"] = "@list";
    CommandCategories2["HASH"] = "@hash";
    CommandCategories2["STRING"] = "@string";
    CommandCategories2["BITMAP"] = "@bitmap";
    CommandCategories2["HYPERLOGLOG"] = "@hyperloglog";
    CommandCategories2["GEO"] = "@geo";
    CommandCategories2["STREAM"] = "@stream";
    CommandCategories2["PUBSUB"] = "@pubsub";
    CommandCategories2["ADMIN"] = "@admin";
    CommandCategories2["FAST"] = "@fast";
    CommandCategories2["SLOW"] = "@slow";
    CommandCategories2["BLOCKING"] = "@blocking";
    CommandCategories2["DANGEROUS"] = "@dangerous";
    CommandCategories2["CONNECTION"] = "@connection";
    CommandCategories2["TRANSACTION"] = "@transaction";
    CommandCategories2["SCRIPTING"] = "@scripting";
  })(CommandCategories || (exports.CommandCategories = CommandCategories = {}));
  exports.transformCommandReply = transformCommandReply;
  var RedisFunctionFlags;
  (function(RedisFunctionFlags2) {
    RedisFunctionFlags2["NO_WRITES"] = "no-writes";
    RedisFunctionFlags2["ALLOW_OOM"] = "allow-oom";
    RedisFunctionFlags2["ALLOW_STALE"] = "allow-stale";
    RedisFunctionFlags2["NO_CLUSTER"] = "no-cluster";
  })(RedisFunctionFlags || (exports.RedisFunctionFlags = RedisFunctionFlags = {}));
  exports.transformFunctionListItemReply = transformFunctionListItemReply;
  exports.pushSortArguments = pushSortArguments;
  exports.pushSlotRangesArguments = pushSlotRangesArguments;
  exports.transformRangeReply = transformRangeReply;
});

// node_modules/@redis/client/dist/lib/commands/BITOP.js
var require_BITOP = __commonJS((exports) => {
  function transformArguments(operation, destKey, key) {
    return (0, generic_transformers_1.pushVerdictArguments)(["BITOP", operation, destKey], key);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BITPOS.js
var require_BITPOS = __commonJS((exports) => {
  function transformArguments(key, bit, start, end, mode) {
    const args = ["BITPOS", key, bit.toString()];
    if (typeof start === "number") {
      args.push(start.toString());
    }
    if (typeof end === "number") {
      args.push(end.toString());
    }
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BLMOVE.js
var require_BLMOVE = __commonJS((exports) => {
  function transformArguments(source, destination, sourceDirection, destinationDirection, timeout) {
    return [
      "BLMOVE",
      source,
      destination,
      sourceDirection,
      destinationDirection,
      timeout.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LMPOP.js
var require_LMPOP = __commonJS((exports) => {
  function transformArguments(keys, side, options) {
    return (0, generic_transformers_1.transformLMPopArguments)(["LMPOP"], keys, side, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BLMPOP.js
var require_BLMPOP = __commonJS((exports) => {
  function transformArguments(timeout, keys, side, options) {
    return (0, generic_transformers_1.transformLMPopArguments)(["BLMPOP", timeout.toString()], keys, side, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 3;
  exports.transformArguments = transformArguments;
  var LMPOP_1 = require_LMPOP();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return LMPOP_1.transformReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/BLPOP.js
var require_BLPOP = __commonJS((exports) => {
  function transformArguments(keys, timeout) {
    const args = (0, generic_transformers_1.pushVerdictArguments)(["BLPOP"], keys);
    args.push(timeout.toString());
    return args;
  }
  function transformReply(reply) {
    if (reply === null)
      return null;
    return {
      key: reply[0],
      element: reply[1]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/BRPOP.js
var require_BRPOP = __commonJS((exports) => {
  function transformArguments(key, timeout) {
    const args = (0, generic_transformers_1.pushVerdictArguments)(["BRPOP"], key);
    args.push(timeout.toString());
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var BLPOP_1 = require_BLPOP();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return BLPOP_1.transformReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/BRPOPLPUSH.js
var require_BRPOPLPUSH = __commonJS((exports) => {
  function transformArguments(source, destination, timeout) {
    return ["BRPOPLPUSH", source, destination, timeout.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZMPOP.js
var require_ZMPOP = __commonJS((exports) => {
  function transformArguments(keys, side, options) {
    return (0, generic_transformers_1.transformZMPopArguments)(["ZMPOP"], keys, side, options);
  }
  function transformReply(reply) {
    return reply === null ? null : {
      key: reply[0],
      elements: reply[1].map(generic_transformers_1.transformSortedSetMemberReply)
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/BZMPOP.js
var require_BZMPOP = __commonJS((exports) => {
  function transformArguments(timeout, keys, side, options) {
    return (0, generic_transformers_1.transformZMPopArguments)(["BZMPOP", timeout.toString()], keys, side, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 3;
  exports.transformArguments = transformArguments;
  var ZMPOP_1 = require_ZMPOP();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return ZMPOP_1.transformReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/BZPOPMAX.js
var require_BZPOPMAX = __commonJS((exports) => {
  function transformArguments(key, timeout) {
    const args = (0, generic_transformers_1.pushVerdictArguments)(["BZPOPMAX"], key);
    args.push(timeout.toString());
    return args;
  }
  function transformReply(reply) {
    if (!reply)
      return null;
    return {
      key: reply[0],
      value: reply[1],
      score: (0, generic_transformers_1.transformNumberInfinityReply)(reply[2])
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/BZPOPMIN.js
var require_BZPOPMIN = __commonJS((exports) => {
  function transformArguments(key, timeout) {
    const args = (0, generic_transformers_1.pushVerdictArguments)(["BZPOPMIN"], key);
    args.push(timeout.toString());
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var BZPOPMAX_1 = require_BZPOPMAX();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return BZPOPMAX_1.transformReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/COPY.js
var require_COPY = __commonJS((exports) => {
  function transformArguments(source, destination, options) {
    const args = ["COPY", source, destination];
    if (options?.destinationDb) {
      args.push("DB", options.destinationDb.toString());
    }
    if (options?.replace) {
      args.push("REPLACE");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/DECR.js
var require_DECR = __commonJS((exports) => {
  function transformArguments(key) {
    return ["DECR", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/DECRBY.js
var require_DECRBY = __commonJS((exports) => {
  function transformArguments(key, decrement) {
    return ["DECRBY", key, decrement.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/DEL.js
var require_DEL = __commonJS((exports) => {
  function transformArguments(keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["DEL"], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/DUMP.js
var require_DUMP = __commonJS((exports) => {
  function transformArguments(key) {
    return ["DUMP", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/EVAL_RO.js
var require_EVAL_RO = __commonJS((exports) => {
  function transformArguments(script, options) {
    return (0, generic_transformers_1.pushEvalArguments)(["EVAL_RO", script], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = generic_transformers_1.evalFirstKeyIndex;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/EVAL.js
var require_EVAL = __commonJS((exports) => {
  function transformArguments(script, options) {
    return (0, generic_transformers_1.pushEvalArguments)(["EVAL", script], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = generic_transformers_1.evalFirstKeyIndex;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/EVALSHA_RO.js
var require_EVALSHA_RO = __commonJS((exports) => {
  function transformArguments(sha1, options) {
    return (0, generic_transformers_1.pushEvalArguments)(["EVALSHA_RO", sha1], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = generic_transformers_1.evalFirstKeyIndex;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/EVALSHA.js
var require_EVALSHA = __commonJS((exports) => {
  function transformArguments(sha1, options) {
    return (0, generic_transformers_1.pushEvalArguments)(["EVALSHA", sha1], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = generic_transformers_1.evalFirstKeyIndex;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/EXISTS.js
var require_EXISTS = __commonJS((exports) => {
  function transformArguments(keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["EXISTS"], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/EXPIRE.js
var require_EXPIRE = __commonJS((exports) => {
  function transformArguments(key, seconds, mode) {
    const args = ["EXPIRE", key, seconds.toString()];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/EXPIREAT.js
var require_EXPIREAT = __commonJS((exports) => {
  function transformArguments(key, timestamp, mode) {
    const args = [
      "EXPIREAT",
      key,
      (0, generic_transformers_1.transformEXAT)(timestamp)
    ];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/EXPIRETIME.js
var require_EXPIRETIME = __commonJS((exports) => {
  function transformArguments(key) {
    return ["EXPIRETIME", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FCALL_RO.js
var require_FCALL_RO = __commonJS((exports) => {
  function transformArguments(fn, options) {
    return (0, generic_transformers_1.pushEvalArguments)(["FCALL_RO", fn], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = generic_transformers_1.evalFirstKeyIndex;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FCALL.js
var require_FCALL = __commonJS((exports) => {
  function transformArguments(fn, options) {
    return (0, generic_transformers_1.pushEvalArguments)(["FCALL", fn], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = generic_transformers_1.evalFirstKeyIndex;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEOADD.js
var require_GEOADD = __commonJS((exports) => {
  function transformArguments(key, toAdd, options) {
    const args = ["GEOADD", key];
    if (options?.NX) {
      args.push("NX");
    } else if (options?.XX) {
      args.push("XX");
    }
    if (options?.CH) {
      args.push("CH");
    }
    for (const { longitude, latitude, member } of Array.isArray(toAdd) ? toAdd : [toAdd]) {
      args.push(longitude.toString(), latitude.toString(), member);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEODIST.js
var require_GEODIST = __commonJS((exports) => {
  function transformArguments(key, member1, member2, unit) {
    const args = ["GEODIST", key, member1, member2];
    if (unit) {
      args.push(unit);
    }
    return args;
  }
  function transformReply(reply) {
    return reply === null ? null : Number(reply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/GEOHASH.js
var require_GEOHASH = __commonJS((exports) => {
  function transformArguments(key, member) {
    return (0, generic_transformers_1.pushVerdictArguments)(["GEOHASH", key], member);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEOPOS.js
var require_GEOPOS = __commonJS((exports) => {
  function transformArguments(key, member) {
    return (0, generic_transformers_1.pushVerdictArguments)(["GEOPOS", key], member);
  }
  function transformReply(reply) {
    return reply.map((coordinates) => coordinates === null ? null : {
      longitude: coordinates[0],
      latitude: coordinates[1]
    });
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUS_RO.js
var require_GEORADIUS_RO = __commonJS((exports) => {
  function transformArguments(key, coordinates, radius, unit, options) {
    return (0, generic_transformers_1.pushGeoRadiusArguments)(["GEORADIUS_RO"], key, coordinates, radius, unit, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUS_RO_WITH.js
var require_GEORADIUS_RO_WITH = __commonJS((exports) => {
  function transformArguments(key, coordinates, radius, unit, replyWith, options) {
    const args = (0, GEORADIUS_RO_1.transformArguments)(key, coordinates, radius, unit, options);
    args.push(...replyWith);
    args.preserve = replyWith;
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var GEORADIUS_RO_1 = require_GEORADIUS_RO();
  var GEORADIUS_RO_2 = require_GEORADIUS_RO();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEORADIUS_RO_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEORADIUS_RO_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformGeoMembersWithReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUS.js
var require_GEORADIUS = __commonJS((exports) => {
  function transformArguments(key, coordinates, radius, unit, options) {
    return (0, generic_transformers_1.pushGeoRadiusArguments)(["GEORADIUS"], key, coordinates, radius, unit, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUS_WITH.js
var require_GEORADIUS_WITH = __commonJS((exports) => {
  function transformArguments(key, coordinates, radius, unit, replyWith, options) {
    const args = (0, GEORADIUS_1.transformArguments)(key, coordinates, radius, unit, options);
    args.push(...replyWith);
    args.preserve = replyWith;
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var GEORADIUS_1 = require_GEORADIUS();
  var GEORADIUS_2 = require_GEORADIUS();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEORADIUS_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEORADIUS_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformGeoMembersWithReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUSBYMEMBER_RO.js
var require_GEORADIUSBYMEMBER_RO = __commonJS((exports) => {
  function transformArguments(key, member, radius, unit, options) {
    return (0, generic_transformers_1.pushGeoRadiusArguments)(["GEORADIUSBYMEMBER_RO"], key, member, radius, unit, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUSBYMEMBER_RO_WITH.js
var require_GEORADIUSBYMEMBER_RO_WITH = __commonJS((exports) => {
  function transformArguments(key, member, radius, unit, replyWith, options) {
    const args = (0, GEORADIUSBYMEMBER_RO_1.transformArguments)(key, member, radius, unit, options);
    args.push(...replyWith);
    args.preserve = replyWith;
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var GEORADIUSBYMEMBER_RO_1 = require_GEORADIUSBYMEMBER_RO();
  var GEORADIUSBYMEMBER_RO_2 = require_GEORADIUSBYMEMBER_RO();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEORADIUSBYMEMBER_RO_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEORADIUSBYMEMBER_RO_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformGeoMembersWithReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUSBYMEMBER.js
var require_GEORADIUSBYMEMBER = __commonJS((exports) => {
  function transformArguments(key, member, radius, unit, options) {
    return (0, generic_transformers_1.pushGeoRadiusArguments)(["GEORADIUSBYMEMBER"], key, member, radius, unit, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUSBYMEMBER_WITH.js
var require_GEORADIUSBYMEMBER_WITH = __commonJS((exports) => {
  function transformArguments(key, member, radius, unit, replyWith, options) {
    const args = (0, GEORADIUSBYMEMBER_1.transformArguments)(key, member, radius, unit, options);
    args.push(...replyWith);
    args.preserve = replyWith;
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var GEORADIUSBYMEMBER_1 = require_GEORADIUSBYMEMBER();
  var GEORADIUSBYMEMBER_2 = require_GEORADIUSBYMEMBER();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEORADIUSBYMEMBER_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEORADIUSBYMEMBER_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformGeoMembersWithReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUSBYMEMBERSTORE.js
var require_GEORADIUSBYMEMBERSTORE = __commonJS((exports) => {
  function transformArguments(key, member, radius, unit, destination, options) {
    return (0, generic_transformers_1.pushGeoRadiusStoreArguments)(["GEORADIUSBYMEMBER"], key, member, radius, unit, destination, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var GEORADIUSBYMEMBER_1 = require_GEORADIUSBYMEMBER();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEORADIUSBYMEMBER_1.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEORADIUSBYMEMBER_1.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEORADIUSSTORE.js
var require_GEORADIUSSTORE = __commonJS((exports) => {
  function transformArguments(key, coordinates, radius, unit, destination, options) {
    return (0, generic_transformers_1.pushGeoRadiusStoreArguments)(["GEORADIUS"], key, coordinates, radius, unit, destination, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var GEORADIUS_1 = require_GEORADIUS();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEORADIUS_1.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEORADIUS_1.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEOSEARCH.js
var require_GEOSEARCH = __commonJS((exports) => {
  function transformArguments(key, from, by, options) {
    return (0, generic_transformers_1.pushGeoSearchArguments)(["GEOSEARCH"], key, from, by, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GEOSEARCH_WITH.js
var require_GEOSEARCH_WITH = __commonJS((exports) => {
  function transformArguments(key, from, by, replyWith, options) {
    const args = (0, GEOSEARCH_1.transformArguments)(key, from, by, options);
    args.push(...replyWith);
    args.preserve = replyWith;
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var GEOSEARCH_1 = require_GEOSEARCH();
  var GEOSEARCH_2 = require_GEOSEARCH();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEOSEARCH_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEOSEARCH_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformGeoMembersWithReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/GEOSEARCHSTORE.js
var require_GEOSEARCHSTORE = __commonJS((exports) => {
  function transformArguments(destination, source, from, by, options) {
    const args = (0, generic_transformers_1.pushGeoSearchArguments)(["GEOSEARCHSTORE", destination], source, from, by, options);
    if (options?.STOREDIST) {
      args.push("STOREDIST");
    }
    return args;
  }
  function transformReply(reply) {
    if (typeof reply !== "number") {
      throw new TypeError(`https://github.com/redis/redis/issues/9261`);
    }
    return reply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var GEOSEARCH_1 = require_GEOSEARCH();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return GEOSEARCH_1.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return GEOSEARCH_1.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/GET.js
var require_GET = __commonJS((exports) => {
  function transformArguments(key) {
    return ["GET", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GETBIT.js
var require_GETBIT = __commonJS((exports) => {
  function transformArguments(key, offset) {
    return ["GETBIT", key, offset.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GETDEL.js
var require_GETDEL = __commonJS((exports) => {
  function transformArguments(key) {
    return ["GETDEL", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GETEX.js
var require_GETEX = __commonJS((exports) => {
  function transformArguments(key, mode) {
    const args = ["GETEX", key];
    if ("EX" in mode) {
      args.push("EX", mode.EX.toString());
    } else if ("PX" in mode) {
      args.push("PX", mode.PX.toString());
    } else if ("EXAT" in mode) {
      args.push("EXAT", (0, generic_transformers_1.transformEXAT)(mode.EXAT));
    } else if ("PXAT" in mode) {
      args.push("PXAT", (0, generic_transformers_1.transformPXAT)(mode.PXAT));
    } else {
      args.push("PERSIST");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GETRANGE.js
var require_GETRANGE = __commonJS((exports) => {
  function transformArguments(key, start, end) {
    return ["GETRANGE", key, start.toString(), end.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/GETSET.js
var require_GETSET = __commonJS((exports) => {
  function transformArguments(key, value) {
    return ["GETSET", key, value];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HDEL.js
var require_HDEL = __commonJS((exports) => {
  function transformArguments(key, field) {
    return (0, generic_transformers_1.pushVerdictArguments)(["HDEL", key], field);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HEXISTS.js
var require_HEXISTS = __commonJS((exports) => {
  function transformArguments(key, field) {
    return ["HEXISTS", key, field];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/HEXPIRE.js
var require_HEXPIRE = __commonJS((exports) => {
  function transformArguments(key, fields, seconds, mode) {
    const args = ["HEXPIRE", key, seconds.toString()];
    if (mode) {
      args.push(mode);
    }
    args.push("FIELDS");
    return (0, generic_transformers_1.pushVerdictArgument)(args, fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = exports.HASH_EXPIRATION = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.HASH_EXPIRATION = {
    FIELD_NOT_EXISTS: -2,
    CONDITION_NOT_MET: 0,
    UPDATED: 1,
    DELETED: 2
  };
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HEXPIREAT.js
var require_HEXPIREAT = __commonJS((exports) => {
  function transformArguments(key, fields, timestamp, mode) {
    const args = [
      "HEXPIREAT",
      key,
      (0, generic_transformers_1.transformEXAT)(timestamp)
    ];
    if (mode) {
      args.push(mode);
    }
    args.push("FIELDS");
    return (0, generic_transformers_1.pushVerdictArgument)(args, fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HEXPIRETIME.js
var require_HEXPIRETIME = __commonJS((exports) => {
  function transformArguments(key, fields) {
    return (0, generic_transformers_1.pushVerdictArgument)(["HEXPIRETIME", key, "FIELDS"], fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = exports.HASH_EXPIRATION_TIME = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.HASH_EXPIRATION_TIME = {
    FIELD_NOT_EXISTS: -2,
    NO_EXPIRATION: -1
  };
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HGET.js
var require_HGET = __commonJS((exports) => {
  function transformArguments(key, field) {
    return ["HGET", key, field];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HGETALL.js
var require_HGETALL = __commonJS((exports) => {
  function transformArguments(key) {
    return ["HGETALL", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.TRANSFORM_LEGACY_REPLY = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.TRANSFORM_LEGACY_REPLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformTuplesReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/HINCRBY.js
var require_HINCRBY = __commonJS((exports) => {
  function transformArguments(key, field, increment) {
    return ["HINCRBY", key, field, increment.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HINCRBYFLOAT.js
var require_HINCRBYFLOAT = __commonJS((exports) => {
  function transformArguments(key, field, increment) {
    return ["HINCRBYFLOAT", key, field, increment.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HKEYS.js
var require_HKEYS = __commonJS((exports) => {
  function transformArguments(key) {
    return ["HKEYS", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HLEN.js
var require_HLEN = __commonJS((exports) => {
  function transformArguments(key) {
    return ["HLEN", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HMGET.js
var require_HMGET = __commonJS((exports) => {
  function transformArguments(key, fields) {
    return (0, generic_transformers_1.pushVerdictArguments)(["HMGET", key], fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HPERSIST.js
var require_HPERSIST = __commonJS((exports) => {
  function transformArguments(key, fields) {
    return (0, generic_transformers_1.pushVerdictArgument)(["HPERSIST", key, "FIELDS"], fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HPEXPIRE.js
var require_HPEXPIRE = __commonJS((exports) => {
  function transformArguments(key, fields, ms, mode) {
    const args = ["HPEXPIRE", key, ms.toString()];
    if (mode) {
      args.push(mode);
    }
    args.push("FIELDS");
    return (0, generic_transformers_1.pushVerdictArgument)(args, fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HPEXPIREAT.js
var require_HPEXPIREAT = __commonJS((exports) => {
  function transformArguments(key, fields, timestamp, mode) {
    const args = ["HPEXPIREAT", key, (0, generic_transformers_1.transformPXAT)(timestamp)];
    if (mode) {
      args.push(mode);
    }
    args.push("FIELDS");
    return (0, generic_transformers_1.pushVerdictArgument)(args, fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HPEXPIRETIME.js
var require_HPEXPIRETIME = __commonJS((exports) => {
  function transformArguments(key, fields) {
    return (0, generic_transformers_1.pushVerdictArgument)(["HPEXPIRETIME", key, "FIELDS"], fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HPTTL.js
var require_HPTTL = __commonJS((exports) => {
  function transformArguments(key, fields) {
    return (0, generic_transformers_1.pushVerdictArgument)(["HPTTL", key, "FIELDS"], fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HRANDFIELD.js
var require_HRANDFIELD = __commonJS((exports) => {
  function transformArguments(key) {
    return ["HRANDFIELD", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HRANDFIELD_COUNT.js
var require_HRANDFIELD_COUNT = __commonJS((exports) => {
  function transformArguments(key, count) {
    return [
      ...(0, HRANDFIELD_1.transformArguments)(key),
      count.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var HRANDFIELD_1 = require_HRANDFIELD();
  var HRANDFIELD_2 = require_HRANDFIELD();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return HRANDFIELD_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return HRANDFIELD_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HRANDFIELD_COUNT_WITHVALUES.js
var require_HRANDFIELD_COUNT_WITHVALUES = __commonJS((exports) => {
  function transformArguments(key, count) {
    return [
      ...(0, HRANDFIELD_COUNT_1.transformArguments)(key, count),
      "WITHVALUES"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var HRANDFIELD_COUNT_1 = require_HRANDFIELD_COUNT();
  var HRANDFIELD_COUNT_2 = require_HRANDFIELD_COUNT();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return HRANDFIELD_COUNT_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return HRANDFIELD_COUNT_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformTuplesReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/HSCAN.js
var require_HSCAN = __commonJS((exports) => {
  function transformArguments(key, cursor, options) {
    return (0, generic_transformers_1.pushScanArguments)([
      "HSCAN",
      key
    ], cursor, options);
  }
  function transformReply([cursor, rawTuples]) {
    const parsedTuples = [];
    for (let i = 0;i < rawTuples.length; i += 2) {
      parsedTuples.push({
        field: rawTuples[i],
        value: rawTuples[i + 1]
      });
    }
    return {
      cursor: Number(cursor),
      tuples: parsedTuples
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/HSCAN_NOVALUES.js
var require_HSCAN_NOVALUES = __commonJS((exports) => {
  function transformArguments(key, cursor, options) {
    const args = (0, HSCAN_1.transformArguments)(key, cursor, options);
    args.push("NOVALUES");
    return args;
  }
  function transformReply([cursor, rawData]) {
    return {
      cursor: Number(cursor),
      keys: rawData
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var HSCAN_1 = require_HSCAN();
  var HSCAN_2 = require_HSCAN();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return HSCAN_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return HSCAN_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/HSET.js
var require_HSET = __commonJS((exports) => {
  function transformArguments(...[key, value, fieldValue]) {
    const args = ["HSET", key];
    if (typeof value === "string" || typeof value === "number" || Buffer.isBuffer(value)) {
      args.push(convertValue(value), convertValue(fieldValue));
    } else if (value instanceof Map) {
      pushMap(args, value);
    } else if (Array.isArray(value)) {
      pushTuples(args, value);
    } else {
      pushObject(args, value);
    }
    return args;
  }
  function pushMap(args, map) {
    for (const [key, value] of map.entries()) {
      args.push(convertValue(key), convertValue(value));
    }
  }
  function pushTuples(args, tuples) {
    for (const tuple of tuples) {
      if (Array.isArray(tuple)) {
        pushTuples(args, tuple);
        continue;
      }
      args.push(convertValue(tuple));
    }
  }
  function pushObject(args, object) {
    for (const key of Object.keys(object)) {
      args.push(convertValue(key), convertValue(object[key]));
    }
  }
  function convertValue(value) {
    return typeof value === "number" ? value.toString() : value;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HSETNX.js
var require_HSETNX = __commonJS((exports) => {
  function transformArguments(key, field, value) {
    return ["HSETNX", key, field, value];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/HSTRLEN.js
var require_HSTRLEN = __commonJS((exports) => {
  function transformArguments(key, field) {
    return ["HSTRLEN", key, field];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HTTL.js
var require_HTTL = __commonJS((exports) => {
  function transformArguments(key, fields) {
    return (0, generic_transformers_1.pushVerdictArgument)(["HTTL", key, "FIELDS"], fields);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/HVALS.js
var require_HVALS = __commonJS((exports) => {
  function transformArguments(key) {
    return ["HVALS", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/INCR.js
var require_INCR = __commonJS((exports) => {
  function transformArguments(key) {
    return ["INCR", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/INCRBY.js
var require_INCRBY = __commonJS((exports) => {
  function transformArguments(key, increment) {
    return ["INCRBY", key, increment.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/INCRBYFLOAT.js
var require_INCRBYFLOAT = __commonJS((exports) => {
  function transformArguments(key, increment) {
    return ["INCRBYFLOAT", key, increment.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LCS.js
var require_LCS = __commonJS((exports) => {
  function transformArguments(key1, key2) {
    return [
      "LCS",
      key1,
      key2
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LCS_IDX_WITHMATCHLEN.js
var require_LCS_IDX_WITHMATCHLEN = __commonJS((exports) => {
  function transformArguments(key1, key2) {
    const args = (0, LCS_1.transformArguments)(key1, key2);
    args.push("IDX", "WITHMATCHLEN");
    return args;
  }
  function transformReply(reply) {
    return {
      matches: reply[1].map(([key1, key2, length]) => ({
        key1: (0, generic_transformers_1.transformRangeReply)(key1),
        key2: (0, generic_transformers_1.transformRangeReply)(key2),
        length
      })),
      length: reply[3]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var LCS_1 = require_LCS();
  var LCS_2 = require_LCS();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return LCS_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return LCS_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/LCS_IDX.js
var require_LCS_IDX = __commonJS((exports) => {
  function transformArguments(key1, key2) {
    const args = (0, LCS_1.transformArguments)(key1, key2);
    args.push("IDX");
    return args;
  }
  function transformReply(reply) {
    return {
      matches: reply[1].map(([key1, key2]) => ({
        key1: (0, generic_transformers_1.transformRangeReply)(key1),
        key2: (0, generic_transformers_1.transformRangeReply)(key2)
      })),
      length: reply[3]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var LCS_1 = require_LCS();
  var LCS_2 = require_LCS();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return LCS_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return LCS_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/LCS_LEN.js
var require_LCS_LEN = __commonJS((exports) => {
  function transformArguments(key1, key2) {
    const args = (0, LCS_1.transformArguments)(key1, key2);
    args.push("LEN");
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var LCS_1 = require_LCS();
  var LCS_2 = require_LCS();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return LCS_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return LCS_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LINDEX.js
var require_LINDEX = __commonJS((exports) => {
  function transformArguments(key, index) {
    return ["LINDEX", key, index.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LINSERT.js
var require_LINSERT = __commonJS((exports) => {
  function transformArguments(key, position, pivot, element) {
    return [
      "LINSERT",
      key,
      position,
      pivot,
      element
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LLEN.js
var require_LLEN = __commonJS((exports) => {
  function transformArguments(key) {
    return ["LLEN", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LMOVE.js
var require_LMOVE = __commonJS((exports) => {
  function transformArguments(source, destination, sourceSide, destinationSide) {
    return [
      "LMOVE",
      source,
      destination,
      sourceSide,
      destinationSide
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LPOP_COUNT.js
var require_LPOP_COUNT = __commonJS((exports) => {
  function transformArguments(key, count) {
    return ["LPOP", key, count.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LPOP.js
var require_LPOP = __commonJS((exports) => {
  function transformArguments(key) {
    return ["LPOP", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LPOS.js
var require_LPOS = __commonJS((exports) => {
  function transformArguments(key, element, options) {
    const args = ["LPOS", key, element];
    if (typeof options?.RANK === "number") {
      args.push("RANK", options.RANK.toString());
    }
    if (typeof options?.MAXLEN === "number") {
      args.push("MAXLEN", options.MAXLEN.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LPOS_COUNT.js
var require_LPOS_COUNT = __commonJS((exports) => {
  function transformArguments(key, element, count, options) {
    const args = ["LPOS", key, element];
    if (typeof options?.RANK === "number") {
      args.push("RANK", options.RANK.toString());
    }
    args.push("COUNT", count.toString());
    if (typeof options?.MAXLEN === "number") {
      args.push("MAXLEN", options.MAXLEN.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var LPOS_1 = require_LPOS();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return LPOS_1.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return LPOS_1.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LPUSH.js
var require_LPUSH = __commonJS((exports) => {
  function transformArguments(key, elements) {
    return (0, generic_transformers_1.pushVerdictArguments)(["LPUSH", key], elements);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LPUSHX.js
var require_LPUSHX = __commonJS((exports) => {
  function transformArguments(key, element) {
    return (0, generic_transformers_1.pushVerdictArguments)(["LPUSHX", key], element);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LRANGE.js
var require_LRANGE = __commonJS((exports) => {
  function transformArguments(key, start, stop) {
    return [
      "LRANGE",
      key,
      start.toString(),
      stop.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LREM.js
var require_LREM = __commonJS((exports) => {
  function transformArguments(key, count, element) {
    return [
      "LREM",
      key,
      count.toString(),
      element
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LSET.js
var require_LSET = __commonJS((exports) => {
  function transformArguments(key, index, element) {
    return [
      "LSET",
      key,
      index.toString(),
      element
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LTRIM.js
var require_LTRIM = __commonJS((exports) => {
  function transformArguments(key, start, stop) {
    return [
      "LTRIM",
      key,
      start.toString(),
      stop.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MGET.js
var require_MGET = __commonJS((exports) => {
  function transformArguments(keys) {
    return ["MGET", ...keys];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MIGRATE.js
var require_MIGRATE = __commonJS((exports) => {
  function transformArguments(host, port, key, destinationDb, timeout, options) {
    const args = ["MIGRATE", host, port.toString()], isKeyArray = Array.isArray(key);
    if (isKeyArray) {
      args.push("");
    } else {
      args.push(key);
    }
    args.push(destinationDb.toString(), timeout.toString());
    if (options?.COPY) {
      args.push("COPY");
    }
    if (options?.REPLACE) {
      args.push("REPLACE");
    }
    if (options?.AUTH) {
      if (options.AUTH.username) {
        args.push("AUTH2", options.AUTH.username, options.AUTH.password);
      } else {
        args.push("AUTH", options.AUTH.password);
      }
    }
    if (isKeyArray) {
      args.push("KEYS", ...key);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MSET.js
var require_MSET = __commonJS((exports) => {
  function transformArguments(toSet) {
    const args = ["MSET"];
    if (Array.isArray(toSet)) {
      args.push(...toSet.flat());
    } else {
      for (const key of Object.keys(toSet)) {
        args.push(key, toSet[key]);
      }
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MSETNX.js
var require_MSETNX = __commonJS((exports) => {
  function transformArguments(toSet) {
    const args = ["MSETNX"];
    if (Array.isArray(toSet)) {
      args.push(...toSet.flat());
    } else {
      for (const key of Object.keys(toSet)) {
        args.push(key, toSet[key]);
      }
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/OBJECT_ENCODING.js
var require_OBJECT_ENCODING = __commonJS((exports) => {
  function transformArguments(key) {
    return ["OBJECT", "ENCODING", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/OBJECT_FREQ.js
var require_OBJECT_FREQ = __commonJS((exports) => {
  function transformArguments(key) {
    return ["OBJECT", "FREQ", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/OBJECT_IDLETIME.js
var require_OBJECT_IDLETIME = __commonJS((exports) => {
  function transformArguments(key) {
    return ["OBJECT", "IDLETIME", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/OBJECT_REFCOUNT.js
var require_OBJECT_REFCOUNT = __commonJS((exports) => {
  function transformArguments(key) {
    return ["OBJECT", "REFCOUNT", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PERSIST.js
var require_PERSIST = __commonJS((exports) => {
  function transformArguments(key) {
    return ["PERSIST", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/PEXPIRE.js
var require_PEXPIRE = __commonJS((exports) => {
  function transformArguments(key, milliseconds, mode) {
    const args = ["PEXPIRE", key, milliseconds.toString()];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/PEXPIREAT.js
var require_PEXPIREAT = __commonJS((exports) => {
  function transformArguments(key, millisecondsTimestamp, mode) {
    const args = [
      "PEXPIREAT",
      key,
      (0, generic_transformers_1.transformPXAT)(millisecondsTimestamp)
    ];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/PEXPIRETIME.js
var require_PEXPIRETIME = __commonJS((exports) => {
  function transformArguments(key) {
    return ["PEXPIRETIME", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PFADD.js
var require_PFADD = __commonJS((exports) => {
  function transformArguments(key, element) {
    return (0, generic_transformers_1.pushVerdictArguments)(["PFADD", key], element);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/PFCOUNT.js
var require_PFCOUNT = __commonJS((exports) => {
  function transformArguments(key) {
    return (0, generic_transformers_1.pushVerdictArguments)(["PFCOUNT"], key);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PFMERGE.js
var require_PFMERGE = __commonJS((exports) => {
  function transformArguments(destination, source) {
    return (0, generic_transformers_1.pushVerdictArguments)(["PFMERGE", destination], source);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PSETEX.js
var require_PSETEX = __commonJS((exports) => {
  function transformArguments(key, milliseconds, value) {
    return [
      "PSETEX",
      key,
      milliseconds.toString(),
      value
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PTTL.js
var require_PTTL = __commonJS((exports) => {
  function transformArguments(key) {
    return ["PTTL", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PUBLISH.js
var require_PUBLISH = __commonJS((exports) => {
  function transformArguments(channel, message) {
    return ["PUBLISH", channel, message];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RENAME.js
var require_RENAME = __commonJS((exports) => {
  function transformArguments(key, newKey) {
    return ["RENAME", key, newKey];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RENAMENX.js
var require_RENAMENX = __commonJS((exports) => {
  function transformArguments(key, newKey) {
    return ["RENAMENX", key, newKey];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/RESTORE.js
var require_RESTORE = __commonJS((exports) => {
  function transformArguments(key, ttl, serializedValue, options) {
    const args = ["RESTORE", key, ttl.toString(), serializedValue];
    if (options?.REPLACE) {
      args.push("REPLACE");
    }
    if (options?.ABSTTL) {
      args.push("ABSTTL");
    }
    if (options?.IDLETIME) {
      args.push("IDLETIME", options.IDLETIME.toString());
    }
    if (options?.FREQ) {
      args.push("FREQ", options.FREQ.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RPOP_COUNT.js
var require_RPOP_COUNT = __commonJS((exports) => {
  function transformArguments(key, count) {
    return ["RPOP", key, count.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RPOP.js
var require_RPOP = __commonJS((exports) => {
  function transformArguments(key) {
    return ["RPOP", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RPOPLPUSH.js
var require_RPOPLPUSH = __commonJS((exports) => {
  function transformArguments(source, destination) {
    return ["RPOPLPUSH", source, destination];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RPUSH.js
var require_RPUSH = __commonJS((exports) => {
  function transformArguments(key, element) {
    return (0, generic_transformers_1.pushVerdictArguments)(["RPUSH", key], element);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RPUSHX.js
var require_RPUSHX = __commonJS((exports) => {
  function transformArguments(key, element) {
    return (0, generic_transformers_1.pushVerdictArguments)(["RPUSHX", key], element);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SADD.js
var require_SADD = __commonJS((exports) => {
  function transformArguments(key, members) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SADD", key], members);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SCARD.js
var require_SCARD = __commonJS((exports) => {
  function transformArguments(key) {
    return ["SCARD", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SDIFF.js
var require_SDIFF = __commonJS((exports) => {
  function transformArguments(keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SDIFF"], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SDIFFSTORE.js
var require_SDIFFSTORE = __commonJS((exports) => {
  function transformArguments(destination, keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SDIFFSTORE", destination], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SET.js
var require_SET = __commonJS((exports) => {
  function transformArguments(key, value, options) {
    const args = [
      "SET",
      key,
      typeof value === "number" ? value.toString() : value
    ];
    if (options?.EX !== undefined) {
      args.push("EX", options.EX.toString());
    } else if (options?.PX !== undefined) {
      args.push("PX", options.PX.toString());
    } else if (options?.EXAT !== undefined) {
      args.push("EXAT", options.EXAT.toString());
    } else if (options?.PXAT !== undefined) {
      args.push("PXAT", options.PXAT.toString());
    } else if (options?.KEEPTTL) {
      args.push("KEEPTTL");
    }
    if (options?.NX) {
      args.push("NX");
    } else if (options?.XX) {
      args.push("XX");
    }
    if (options?.GET) {
      args.push("GET");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SETBIT.js
var require_SETBIT = __commonJS((exports) => {
  function transformArguments(key, offset, value) {
    return ["SETBIT", key, offset.toString(), value.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SETEX.js
var require_SETEX = __commonJS((exports) => {
  function transformArguments(key, seconds, value) {
    return [
      "SETEX",
      key,
      seconds.toString(),
      value
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SETNX.js
var require_SETNX = __commonJS((exports) => {
  function transformArguments(key, value) {
    return ["SETNX", key, value];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/SETRANGE.js
var require_SETRANGE = __commonJS((exports) => {
  function transformArguments(key, offset, value) {
    return ["SETRANGE", key, offset.toString(), value];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SINTER.js
var require_SINTER = __commonJS((exports) => {
  function transformArguments(keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SINTER"], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SINTERCARD.js
var require_SINTERCARD = __commonJS((exports) => {
  function transformArguments(keys, limit) {
    const args = (0, generic_transformers_1.pushVerdictArgument)(["SINTERCARD"], keys);
    if (limit) {
      args.push("LIMIT", limit.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SINTERSTORE.js
var require_SINTERSTORE = __commonJS((exports) => {
  function transformArguments(destination, keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SINTERSTORE", destination], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SISMEMBER.js
var require_SISMEMBER = __commonJS((exports) => {
  function transformArguments(key, member) {
    return ["SISMEMBER", key, member];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/SMEMBERS.js
var require_SMEMBERS = __commonJS((exports) => {
  function transformArguments(key) {
    return ["SMEMBERS", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SMISMEMBER.js
var require_SMISMEMBER = __commonJS((exports) => {
  function transformArguments(key, members) {
    return ["SMISMEMBER", key, ...members];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanArrayReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/SMOVE.js
var require_SMOVE = __commonJS((exports) => {
  function transformArguments(source, destination, member) {
    return ["SMOVE", source, destination, member];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/SORT_RO.js
var require_SORT_RO = __commonJS((exports) => {
  function transformArguments(key, options) {
    return (0, generic_transformers_1.pushSortArguments)(["SORT_RO", key], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SORT.js
var require_SORT = __commonJS((exports) => {
  function transformArguments(key, options) {
    return (0, generic_transformers_1.pushSortArguments)(["SORT", key], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SORT_STORE.js
var require_SORT_STORE = __commonJS((exports) => {
  function transformArguments(source, destination, options) {
    const args = (0, SORT_1.transformArguments)(source, options);
    args.push("STORE", destination);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var SORT_1 = require_SORT();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SPOP.js
var require_SPOP = __commonJS((exports) => {
  function transformArguments(key, count) {
    const args = ["SPOP", key];
    if (typeof count === "number") {
      args.push(count.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SPUBLISH.js
var require_SPUBLISH = __commonJS((exports) => {
  function transformArguments(channel, message) {
    return ["SPUBLISH", channel, message];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SRANDMEMBER.js
var require_SRANDMEMBER = __commonJS((exports) => {
  function transformArguments(key) {
    return ["SRANDMEMBER", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SRANDMEMBER_COUNT.js
var require_SRANDMEMBER_COUNT = __commonJS((exports) => {
  function transformArguments(key, count) {
    return [
      ...(0, SRANDMEMBER_1.transformArguments)(key),
      count.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var SRANDMEMBER_1 = require_SRANDMEMBER();
  var SRANDMEMBER_2 = require_SRANDMEMBER();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return SRANDMEMBER_2.FIRST_KEY_INDEX;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SREM.js
var require_SREM = __commonJS((exports) => {
  function transformArguments(key, members) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SREM", key], members);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SSCAN.js
var require_SSCAN = __commonJS((exports) => {
  function transformArguments(key, cursor, options) {
    return (0, generic_transformers_1.pushScanArguments)([
      "SSCAN",
      key
    ], cursor, options);
  }
  function transformReply([cursor, members]) {
    return {
      cursor: Number(cursor),
      members
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/STRLEN.js
var require_STRLEN = __commonJS((exports) => {
  function transformArguments(key) {
    return ["STRLEN", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SUNION.js
var require_SUNION = __commonJS((exports) => {
  function transformArguments(keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SUNION"], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SUNIONSTORE.js
var require_SUNIONSTORE = __commonJS((exports) => {
  function transformArguments(destination, keys) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SUNIONSTORE", destination], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/TOUCH.js
var require_TOUCH = __commonJS((exports) => {
  function transformArguments(key) {
    return (0, generic_transformers_1.pushVerdictArguments)(["TOUCH"], key);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/TTL.js
var require_TTL = __commonJS((exports) => {
  function transformArguments(key) {
    return ["TTL", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/TYPE.js
var require_TYPE = __commonJS((exports) => {
  function transformArguments(key) {
    return ["TYPE", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/UNLINK.js
var require_UNLINK = __commonJS((exports) => {
  function transformArguments(key) {
    return (0, generic_transformers_1.pushVerdictArguments)(["UNLINK"], key);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/WATCH.js
var require_WATCH = __commonJS((exports) => {
  function transformArguments(key) {
    return (0, generic_transformers_1.pushVerdictArguments)(["WATCH"], key);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XACK.js
var require_XACK = __commonJS((exports) => {
  function transformArguments(key, group, id) {
    return (0, generic_transformers_1.pushVerdictArguments)(["XACK", key, group], id);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XADD.js
var require_XADD = __commonJS((exports) => {
  function transformArguments(key, id, message, options) {
    const args = ["XADD", key];
    if (options?.NOMKSTREAM) {
      args.push("NOMKSTREAM");
    }
    if (options?.TRIM) {
      if (options.TRIM.strategy) {
        args.push(options.TRIM.strategy);
      }
      if (options.TRIM.strategyModifier) {
        args.push(options.TRIM.strategyModifier);
      }
      args.push(options.TRIM.threshold.toString());
      if (options.TRIM.limit) {
        args.push("LIMIT", options.TRIM.limit.toString());
      }
    }
    args.push(id);
    for (const [key2, value] of Object.entries(message)) {
      args.push(key2, value);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XAUTOCLAIM.js
var require_XAUTOCLAIM = __commonJS((exports) => {
  function transformArguments(key, group, consumer, minIdleTime, start, options) {
    const args = ["XAUTOCLAIM", key, group, consumer, minIdleTime.toString(), start];
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  function transformReply(reply) {
    return {
      nextId: reply[0],
      messages: (0, generic_transformers_1.transformStreamMessagesNullReply)(reply[1])
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/XAUTOCLAIM_JUSTID.js
var require_XAUTOCLAIM_JUSTID = __commonJS((exports) => {
  function transformArguments(...args) {
    return [
      ...(0, XAUTOCLAIM_1.transformArguments)(...args),
      "JUSTID"
    ];
  }
  function transformReply(reply) {
    return {
      nextId: reply[0],
      messages: reply[1]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var XAUTOCLAIM_1 = require_XAUTOCLAIM();
  var XAUTOCLAIM_2 = require_XAUTOCLAIM();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return XAUTOCLAIM_2.FIRST_KEY_INDEX;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/XCLAIM.js
var require_XCLAIM = __commonJS((exports) => {
  function transformArguments(key, group, consumer, minIdleTime, id, options) {
    const args = (0, generic_transformers_1.pushVerdictArguments)(["XCLAIM", key, group, consumer, minIdleTime.toString()], id);
    if (options?.IDLE) {
      args.push("IDLE", options.IDLE.toString());
    }
    if (options?.TIME) {
      args.push("TIME", (typeof options.TIME === "number" ? options.TIME : options.TIME.getTime()).toString());
    }
    if (options?.RETRYCOUNT) {
      args.push("RETRYCOUNT", options.RETRYCOUNT.toString());
    }
    if (options?.FORCE) {
      args.push("FORCE");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformStreamMessagesNullReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/XCLAIM_JUSTID.js
var require_XCLAIM_JUSTID = __commonJS((exports) => {
  function transformArguments(...args) {
    return [
      ...(0, XCLAIM_1.transformArguments)(...args),
      "JUSTID"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var XCLAIM_1 = require_XCLAIM();
  var XCLAIM_2 = require_XCLAIM();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return XCLAIM_2.FIRST_KEY_INDEX;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XDEL.js
var require_XDEL = __commonJS((exports) => {
  function transformArguments(key, id) {
    return (0, generic_transformers_1.pushVerdictArguments)(["XDEL", key], id);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XGROUP_CREATE.js
var require_XGROUP_CREATE = __commonJS((exports) => {
  function transformArguments(key, group, id, options) {
    const args = ["XGROUP", "CREATE", key, group, id];
    if (options?.MKSTREAM) {
      args.push("MKSTREAM");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XGROUP_CREATECONSUMER.js
var require_XGROUP_CREATECONSUMER = __commonJS((exports) => {
  function transformArguments(key, group, consumer) {
    return ["XGROUP", "CREATECONSUMER", key, group, consumer];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/XGROUP_DELCONSUMER.js
var require_XGROUP_DELCONSUMER = __commonJS((exports) => {
  function transformArguments(key, group, consumer) {
    return ["XGROUP", "DELCONSUMER", key, group, consumer];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XGROUP_DESTROY.js
var require_XGROUP_DESTROY = __commonJS((exports) => {
  function transformArguments(key, group) {
    return ["XGROUP", "DESTROY", key, group];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/XGROUP_SETID.js
var require_XGROUP_SETID = __commonJS((exports) => {
  function transformArguments(key, group, id) {
    return ["XGROUP", "SETID", key, group, id];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XINFO_CONSUMERS.js
var require_XINFO_CONSUMERS = __commonJS((exports) => {
  function transformArguments(key, group) {
    return ["XINFO", "CONSUMERS", key, group];
  }
  function transformReply(rawReply) {
    return rawReply.map((consumer) => ({
      name: consumer[1],
      pending: consumer[3],
      idle: consumer[5],
      inactive: consumer[7]
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/XINFO_GROUPS.js
var require_XINFO_GROUPS = __commonJS((exports) => {
  function transformArguments(key) {
    return ["XINFO", "GROUPS", key];
  }
  function transformReply(rawReply) {
    return rawReply.map((group) => ({
      name: group[1],
      consumers: group[3],
      pending: group[5],
      lastDeliveredId: group[7]
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/XINFO_STREAM.js
var require_XINFO_STREAM = __commonJS((exports) => {
  function transformArguments(key) {
    return ["XINFO", "STREAM", key];
  }
  function transformReply(rawReply) {
    const parsedReply = {};
    for (let i = 0;i < rawReply.length; i += 2) {
      switch (rawReply[i]) {
        case "length":
          parsedReply.length = rawReply[i + 1];
          break;
        case "radix-tree-keys":
          parsedReply.radixTreeKeys = rawReply[i + 1];
          break;
        case "radix-tree-nodes":
          parsedReply.radixTreeNodes = rawReply[i + 1];
          break;
        case "groups":
          parsedReply.groups = rawReply[i + 1];
          break;
        case "last-generated-id":
          parsedReply.lastGeneratedId = rawReply[i + 1];
          break;
        case "first-entry":
          parsedReply.firstEntry = rawReply[i + 1] ? {
            id: rawReply[i + 1][0],
            message: (0, generic_transformers_1.transformTuplesReply)(rawReply[i + 1][1])
          } : null;
          break;
        case "last-entry":
          parsedReply.lastEntry = rawReply[i + 1] ? {
            id: rawReply[i + 1][0],
            message: (0, generic_transformers_1.transformTuplesReply)(rawReply[i + 1][1])
          } : null;
          break;
      }
    }
    return parsedReply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/XLEN.js
var require_XLEN = __commonJS((exports) => {
  function transformArguments(key) {
    return ["XLEN", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XPENDING_RANGE.js
var require_XPENDING_RANGE = __commonJS((exports) => {
  function transformArguments(key, group, start, end, count, options) {
    const args = ["XPENDING", key, group];
    if (options?.IDLE) {
      args.push("IDLE", options.IDLE.toString());
    }
    args.push(start, end, count.toString());
    if (options?.consumer) {
      args.push(options.consumer);
    }
    return args;
  }
  function transformReply(reply) {
    return reply.map(([id, owner, millisecondsSinceLastDelivery, deliveriesCounter]) => ({
      id,
      owner,
      millisecondsSinceLastDelivery,
      deliveriesCounter
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/XPENDING.js
var require_XPENDING = __commonJS((exports) => {
  function transformArguments(key, group) {
    return ["XPENDING", key, group];
  }
  function transformReply(reply) {
    return {
      pending: reply[0],
      firstId: reply[1],
      lastId: reply[2],
      consumers: reply[3] === null ? null : reply[3].map(([name, deliveriesCounter]) => ({
        name,
        deliveriesCounter: Number(deliveriesCounter)
      }))
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/XRANGE.js
var require_XRANGE = __commonJS((exports) => {
  function transformArguments(key, start, end, options) {
    const args = ["XRANGE", key, start, end];
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformStreamMessagesReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/XREAD.js
var require_XREAD = __commonJS((exports) => {
  function transformArguments(streams, options) {
    const args = ["XREAD"];
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    if (typeof options?.BLOCK === "number") {
      args.push("BLOCK", options.BLOCK.toString());
    }
    args.push("STREAMS");
    const streamsArray = Array.isArray(streams) ? streams : [streams], argsLength = args.length;
    for (let i = 0;i < streamsArray.length; i++) {
      const stream = streamsArray[i];
      args[argsLength + i] = stream.key;
      args[argsLength + streamsArray.length + i] = stream.id;
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var FIRST_KEY_INDEX = (streams) => {
    return Array.isArray(streams) ? streams[0].key : streams.key;
  };
  exports.FIRST_KEY_INDEX = FIRST_KEY_INDEX;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformStreamsMessagesReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/XREADGROUP.js
var require_XREADGROUP = __commonJS((exports) => {
  function transformArguments(group, consumer, streams, options) {
    const args = ["XREADGROUP", "GROUP", group, consumer];
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    if (typeof options?.BLOCK === "number") {
      args.push("BLOCK", options.BLOCK.toString());
    }
    if (options?.NOACK) {
      args.push("NOACK");
    }
    args.push("STREAMS");
    const streamsArray = Array.isArray(streams) ? streams : [streams], argsLength = args.length;
    for (let i = 0;i < streamsArray.length; i++) {
      const stream = streamsArray[i];
      args[argsLength + i] = stream.key;
      args[argsLength + streamsArray.length + i] = stream.id;
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var FIRST_KEY_INDEX = (_group, _consumer, streams) => {
    return Array.isArray(streams) ? streams[0].key : streams.key;
  };
  exports.FIRST_KEY_INDEX = FIRST_KEY_INDEX;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformStreamsMessagesReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/XREVRANGE.js
var require_XREVRANGE = __commonJS((exports) => {
  function transformArguments(key, start, end, options) {
    const args = ["XREVRANGE", key, start, end];
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformStreamMessagesReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/XSETID.js
var require_XSETID = __commonJS((exports) => {
  function transformArguments(key, lastId, options) {
    const args = ["XSETID", key, lastId];
    if (options?.ENTRIESADDED) {
      args.push("ENTRIESADDED", options.ENTRIESADDED.toString());
    }
    if (options?.MAXDELETEDID) {
      args.push("MAXDELETEDID", options.MAXDELETEDID);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/XTRIM.js
var require_XTRIM = __commonJS((exports) => {
  function transformArguments(key, strategy, threshold, options) {
    const args = ["XTRIM", key, strategy];
    if (options?.strategyModifier) {
      args.push(options.strategyModifier);
    }
    args.push(threshold.toString());
    if (options?.LIMIT) {
      args.push("LIMIT", options.LIMIT.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZADD.js
var require_ZADD = __commonJS((exports) => {
  function transformArguments(key, members, options) {
    const args = ["ZADD", key];
    if (options?.NX) {
      args.push("NX");
    } else {
      if (options?.XX) {
        args.push("XX");
      }
      if (options?.GT) {
        args.push("GT");
      } else if (options?.LT) {
        args.push("LT");
      }
    }
    if (options?.CH) {
      args.push("CH");
    }
    if (options?.INCR) {
      args.push("INCR");
    }
    for (const { score, value } of Array.isArray(members) ? members : [members]) {
      args.push((0, generic_transformers_1.transformNumberInfinityArgument)(score), value);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformNumberInfinityReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZCARD.js
var require_ZCARD = __commonJS((exports) => {
  function transformArguments(key) {
    return ["ZCARD", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZCOUNT.js
var require_ZCOUNT = __commonJS((exports) => {
  function transformArguments(key, min, max) {
    return [
      "ZCOUNT",
      key,
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(min),
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(max)
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZDIFF.js
var require_ZDIFF = __commonJS((exports) => {
  function transformArguments(keys) {
    return (0, generic_transformers_1.pushVerdictArgument)(["ZDIFF"], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZDIFF_WITHSCORES.js
var require_ZDIFF_WITHSCORES = __commonJS((exports) => {
  function transformArguments(...args) {
    return [
      ...(0, ZDIFF_1.transformArguments)(...args),
      "WITHSCORES"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var ZDIFF_1 = require_ZDIFF();
  var ZDIFF_2 = require_ZDIFF();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZDIFF_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return ZDIFF_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZDIFFSTORE.js
var require_ZDIFFSTORE = __commonJS((exports) => {
  function transformArguments(destination, keys) {
    return (0, generic_transformers_1.pushVerdictArgument)(["ZDIFFSTORE", destination], keys);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZINCRBY.js
var require_ZINCRBY = __commonJS((exports) => {
  function transformArguments(key, increment, member) {
    return [
      "ZINCRBY",
      key,
      (0, generic_transformers_1.transformNumberInfinityArgument)(increment),
      member
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformNumberInfinityReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZINTER.js
var require_ZINTER = __commonJS((exports) => {
  function transformArguments(keys, options) {
    const args = (0, generic_transformers_1.pushVerdictArgument)(["ZINTER"], keys);
    if (options?.WEIGHTS) {
      args.push("WEIGHTS", ...options.WEIGHTS.map((weight) => weight.toString()));
    }
    if (options?.AGGREGATE) {
      args.push("AGGREGATE", options.AGGREGATE);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZINTER_WITHSCORES.js
var require_ZINTER_WITHSCORES = __commonJS((exports) => {
  function transformArguments(...args) {
    return [
      ...(0, ZINTER_1.transformArguments)(...args),
      "WITHSCORES"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var ZINTER_1 = require_ZINTER();
  var ZINTER_2 = require_ZINTER();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZINTER_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return ZINTER_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZINTERCARD.js
var require_ZINTERCARD = __commonJS((exports) => {
  function transformArguments(keys, limit) {
    const args = (0, generic_transformers_1.pushVerdictArgument)(["ZINTERCARD"], keys);
    if (limit) {
      args.push("LIMIT", limit.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZINTERSTORE.js
var require_ZINTERSTORE = __commonJS((exports) => {
  function transformArguments(destination, keys, options) {
    const args = (0, generic_transformers_1.pushVerdictArgument)(["ZINTERSTORE", destination], keys);
    if (options?.WEIGHTS) {
      args.push("WEIGHTS", ...options.WEIGHTS.map((weight) => weight.toString()));
    }
    if (options?.AGGREGATE) {
      args.push("AGGREGATE", options.AGGREGATE);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZLEXCOUNT.js
var require_ZLEXCOUNT = __commonJS((exports) => {
  function transformArguments(key, min, max) {
    return [
      "ZLEXCOUNT",
      key,
      min,
      max
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZMSCORE.js
var require_ZMSCORE = __commonJS((exports) => {
  function transformArguments(key, member) {
    return (0, generic_transformers_1.pushVerdictArguments)(["ZMSCORE", key], member);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformNumberInfinityNullArrayReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZPOPMAX.js
var require_ZPOPMAX = __commonJS((exports) => {
  function transformArguments(key) {
    return [
      "ZPOPMAX",
      key
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetMemberNullReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZPOPMAX_COUNT.js
var require_ZPOPMAX_COUNT = __commonJS((exports) => {
  function transformArguments(key, count) {
    return [
      ...(0, ZPOPMAX_1.transformArguments)(key),
      count.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var ZPOPMAX_1 = require_ZPOPMAX();
  var ZPOPMAX_2 = require_ZPOPMAX();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZPOPMAX_2.FIRST_KEY_INDEX;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZPOPMIN.js
var require_ZPOPMIN = __commonJS((exports) => {
  function transformArguments(key) {
    return [
      "ZPOPMIN",
      key
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetMemberNullReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZPOPMIN_COUNT.js
var require_ZPOPMIN_COUNT = __commonJS((exports) => {
  function transformArguments(key, count) {
    return [
      ...(0, ZPOPMIN_1.transformArguments)(key),
      count.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var ZPOPMIN_1 = require_ZPOPMIN();
  var ZPOPMIN_2 = require_ZPOPMIN();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZPOPMIN_2.FIRST_KEY_INDEX;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZRANDMEMBER.js
var require_ZRANDMEMBER = __commonJS((exports) => {
  function transformArguments(key) {
    return ["ZRANDMEMBER", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZRANDMEMBER_COUNT.js
var require_ZRANDMEMBER_COUNT = __commonJS((exports) => {
  function transformArguments(key, count) {
    return [
      ...(0, ZRANDMEMBER_1.transformArguments)(key),
      count.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var ZRANDMEMBER_1 = require_ZRANDMEMBER();
  var ZRANDMEMBER_2 = require_ZRANDMEMBER();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZRANDMEMBER_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return ZRANDMEMBER_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZRANDMEMBER_COUNT_WITHSCORES.js
var require_ZRANDMEMBER_COUNT_WITHSCORES = __commonJS((exports) => {
  function transformArguments(...args) {
    return [
      ...(0, ZRANDMEMBER_COUNT_1.transformArguments)(...args),
      "WITHSCORES"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var ZRANDMEMBER_COUNT_1 = require_ZRANDMEMBER_COUNT();
  var ZRANDMEMBER_COUNT_2 = require_ZRANDMEMBER_COUNT();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZRANDMEMBER_COUNT_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return ZRANDMEMBER_COUNT_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZRANGE.js
var require_ZRANGE = __commonJS((exports) => {
  function transformArguments(key, min, max, options) {
    const args = [
      "ZRANGE",
      key,
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(min),
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(max)
    ];
    switch (options?.BY) {
      case "SCORE":
        args.push("BYSCORE");
        break;
      case "LEX":
        args.push("BYLEX");
        break;
    }
    if (options?.REV) {
      args.push("REV");
    }
    if (options?.LIMIT) {
      args.push("LIMIT", options.LIMIT.offset.toString(), options.LIMIT.count.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZRANGE_WITHSCORES.js
var require_ZRANGE_WITHSCORES = __commonJS((exports) => {
  function transformArguments(...args) {
    return [
      ...(0, ZRANGE_1.transformArguments)(...args),
      "WITHSCORES"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var ZRANGE_1 = require_ZRANGE();
  var ZRANGE_2 = require_ZRANGE();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZRANGE_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return ZRANGE_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZRANGEBYLEX.js
var require_ZRANGEBYLEX = __commonJS((exports) => {
  function transformArguments(key, min, max, options) {
    const args = [
      "ZRANGEBYLEX",
      key,
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(min),
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(max)
    ];
    if (options?.LIMIT) {
      args.push("LIMIT", options.LIMIT.offset.toString(), options.LIMIT.count.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZRANGEBYSCORE.js
var require_ZRANGEBYSCORE = __commonJS((exports) => {
  function transformArguments(key, min, max, options) {
    const args = [
      "ZRANGEBYSCORE",
      key,
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(min),
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(max)
    ];
    if (options?.LIMIT) {
      args.push("LIMIT", options.LIMIT.offset.toString(), options.LIMIT.count.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZRANGEBYSCORE_WITHSCORES.js
var require_ZRANGEBYSCORE_WITHSCORES = __commonJS((exports) => {
  function transformArguments(key, min, max, options) {
    return [
      ...(0, ZRANGEBYSCORE_1.transformArguments)(key, min, max, options),
      "WITHSCORES"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var ZRANGEBYSCORE_1 = require_ZRANGEBYSCORE();
  var ZRANGEBYSCORE_2 = require_ZRANGEBYSCORE();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZRANGEBYSCORE_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return ZRANGEBYSCORE_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZRANGESTORE.js
var require_ZRANGESTORE = __commonJS((exports) => {
  function transformArguments(dst, src, min, max, options) {
    const args = [
      "ZRANGESTORE",
      dst,
      src,
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(min),
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(max)
    ];
    switch (options?.BY) {
      case "SCORE":
        args.push("BYSCORE");
        break;
      case "LEX":
        args.push("BYLEX");
        break;
    }
    if (options?.REV) {
      args.push("REV");
    }
    if (options?.LIMIT) {
      args.push("LIMIT", options.LIMIT.offset.toString(), options.LIMIT.count.toString());
    }
    if (options?.WITHSCORES) {
      args.push("WITHSCORES");
    }
    return args;
  }
  function transformReply(reply) {
    if (typeof reply !== "number") {
      throw new TypeError(`Upgrade to Redis 6.2.5 and up (https://github.com/redis/redis/pull/9089)`);
    }
    return reply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/ZRANK.js
var require_ZRANK = __commonJS((exports) => {
  function transformArguments(key, member) {
    return ["ZRANK", key, member];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZREM.js
var require_ZREM = __commonJS((exports) => {
  function transformArguments(key, member) {
    return (0, generic_transformers_1.pushVerdictArguments)(["ZREM", key], member);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZREMRANGEBYLEX.js
var require_ZREMRANGEBYLEX = __commonJS((exports) => {
  function transformArguments(key, min, max) {
    return [
      "ZREMRANGEBYLEX",
      key,
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(min),
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(max)
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZREMRANGEBYRANK.js
var require_ZREMRANGEBYRANK = __commonJS((exports) => {
  function transformArguments(key, start, stop) {
    return ["ZREMRANGEBYRANK", key, start.toString(), stop.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZREMRANGEBYSCORE.js
var require_ZREMRANGEBYSCORE = __commonJS((exports) => {
  function transformArguments(key, min, max) {
    return [
      "ZREMRANGEBYSCORE",
      key,
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(min),
      (0, generic_transformers_1.transformStringNumberInfinityArgument)(max)
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZREVRANK.js
var require_ZREVRANK = __commonJS((exports) => {
  function transformArguments(key, member) {
    return ["ZREVRANK", key, member];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZSCAN.js
var require_ZSCAN = __commonJS((exports) => {
  function transformArguments(key, cursor, options) {
    return (0, generic_transformers_1.pushScanArguments)([
      "ZSCAN",
      key
    ], cursor, options);
  }
  function transformReply([cursor, rawMembers]) {
    const parsedMembers = [];
    for (let i = 0;i < rawMembers.length; i += 2) {
      parsedMembers.push({
        value: rawMembers[i],
        score: (0, generic_transformers_1.transformNumberInfinityReply)(rawMembers[i + 1])
      });
    }
    return {
      cursor: Number(cursor),
      members: parsedMembers
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/ZSCORE.js
var require_ZSCORE = __commonJS((exports) => {
  function transformArguments(key, member) {
    return ["ZSCORE", key, member];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformNumberInfinityNullReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZUNION.js
var require_ZUNION = __commonJS((exports) => {
  function transformArguments(keys, options) {
    const args = (0, generic_transformers_1.pushVerdictArgument)(["ZUNION"], keys);
    if (options?.WEIGHTS) {
      args.push("WEIGHTS", ...options.WEIGHTS.map((weight) => weight.toString()));
    }
    if (options?.AGGREGATE) {
      args.push("AGGREGATE", options.AGGREGATE);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 2;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ZUNION_WITHSCORES.js
var require_ZUNION_WITHSCORES = __commonJS((exports) => {
  function transformArguments(...args) {
    return [
      ...(0, ZUNION_1.transformArguments)(...args),
      "WITHSCORES"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var ZUNION_1 = require_ZUNION();
  var ZUNION_2 = require_ZUNION();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return ZUNION_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return ZUNION_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformSortedSetWithScoresReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/ZUNIONSTORE.js
var require_ZUNIONSTORE = __commonJS((exports) => {
  function transformArguments(destination, keys, options) {
    const args = (0, generic_transformers_1.pushVerdictArgument)(["ZUNIONSTORE", destination], keys);
    if (options?.WEIGHTS) {
      args.push("WEIGHTS", ...options.WEIGHTS.map((weight) => weight.toString()));
    }
    if (options?.AGGREGATE) {
      args.push("AGGREGATE", options.AGGREGATE);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/cluster/commands.js
var require_commands = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var APPEND = require_APPEND();
  var BITCOUNT = require_BITCOUNT();
  var BITFIELD_RO = require_BITFIELD_RO();
  var BITFIELD = require_BITFIELD();
  var BITOP = require_BITOP();
  var BITPOS = require_BITPOS();
  var BLMOVE = require_BLMOVE();
  var BLMPOP = require_BLMPOP();
  var BLPOP = require_BLPOP();
  var BRPOP = require_BRPOP();
  var BRPOPLPUSH = require_BRPOPLPUSH();
  var BZMPOP = require_BZMPOP();
  var BZPOPMAX = require_BZPOPMAX();
  var BZPOPMIN = require_BZPOPMIN();
  var COPY = require_COPY();
  var DECR = require_DECR();
  var DECRBY = require_DECRBY();
  var DEL = require_DEL();
  var DUMP = require_DUMP();
  var EVAL_RO = require_EVAL_RO();
  var EVAL = require_EVAL();
  var EVALSHA_RO = require_EVALSHA_RO();
  var EVALSHA = require_EVALSHA();
  var EXISTS = require_EXISTS();
  var EXPIRE = require_EXPIRE();
  var EXPIREAT = require_EXPIREAT();
  var EXPIRETIME = require_EXPIRETIME();
  var FCALL_RO = require_FCALL_RO();
  var FCALL = require_FCALL();
  var GEOADD = require_GEOADD();
  var GEODIST = require_GEODIST();
  var GEOHASH = require_GEOHASH();
  var GEOPOS = require_GEOPOS();
  var GEORADIUS_RO_WITH = require_GEORADIUS_RO_WITH();
  var GEORADIUS_RO = require_GEORADIUS_RO();
  var GEORADIUS_WITH = require_GEORADIUS_WITH();
  var GEORADIUS = require_GEORADIUS();
  var GEORADIUSBYMEMBER_RO_WITH = require_GEORADIUSBYMEMBER_RO_WITH();
  var GEORADIUSBYMEMBER_RO = require_GEORADIUSBYMEMBER_RO();
  var GEORADIUSBYMEMBER_WITH = require_GEORADIUSBYMEMBER_WITH();
  var GEORADIUSBYMEMBER = require_GEORADIUSBYMEMBER();
  var GEORADIUSBYMEMBERSTORE = require_GEORADIUSBYMEMBERSTORE();
  var GEORADIUSSTORE = require_GEORADIUSSTORE();
  var GEOSEARCH_WITH = require_GEOSEARCH_WITH();
  var GEOSEARCH = require_GEOSEARCH();
  var GEOSEARCHSTORE = require_GEOSEARCHSTORE();
  var GET = require_GET();
  var GETBIT = require_GETBIT();
  var GETDEL = require_GETDEL();
  var GETEX = require_GETEX();
  var GETRANGE = require_GETRANGE();
  var GETSET = require_GETSET();
  var HDEL = require_HDEL();
  var HEXISTS = require_HEXISTS();
  var HEXPIRE = require_HEXPIRE();
  var HEXPIREAT = require_HEXPIREAT();
  var HEXPIRETIME = require_HEXPIRETIME();
  var HGET = require_HGET();
  var HGETALL = require_HGETALL();
  var HINCRBY = require_HINCRBY();
  var HINCRBYFLOAT = require_HINCRBYFLOAT();
  var HKEYS = require_HKEYS();
  var HLEN = require_HLEN();
  var HMGET = require_HMGET();
  var HPERSIST = require_HPERSIST();
  var HPEXPIRE = require_HPEXPIRE();
  var HPEXPIREAT = require_HPEXPIREAT();
  var HPEXPIRETIME = require_HPEXPIRETIME();
  var HPTTL = require_HPTTL();
  var HRANDFIELD_COUNT_WITHVALUES = require_HRANDFIELD_COUNT_WITHVALUES();
  var HRANDFIELD_COUNT = require_HRANDFIELD_COUNT();
  var HRANDFIELD = require_HRANDFIELD();
  var HSCAN = require_HSCAN();
  var HSCAN_NOVALUES = require_HSCAN_NOVALUES();
  var HSET = require_HSET();
  var HSETNX = require_HSETNX();
  var HSTRLEN = require_HSTRLEN();
  var HTTL = require_HTTL();
  var HVALS = require_HVALS();
  var INCR = require_INCR();
  var INCRBY = require_INCRBY();
  var INCRBYFLOAT = require_INCRBYFLOAT();
  var LCS_IDX_WITHMATCHLEN = require_LCS_IDX_WITHMATCHLEN();
  var LCS_IDX = require_LCS_IDX();
  var LCS_LEN = require_LCS_LEN();
  var LCS = require_LCS();
  var LINDEX = require_LINDEX();
  var LINSERT = require_LINSERT();
  var LLEN = require_LLEN();
  var LMOVE = require_LMOVE();
  var LMPOP = require_LMPOP();
  var LPOP_COUNT = require_LPOP_COUNT();
  var LPOP = require_LPOP();
  var LPOS_COUNT = require_LPOS_COUNT();
  var LPOS = require_LPOS();
  var LPUSH = require_LPUSH();
  var LPUSHX = require_LPUSHX();
  var LRANGE = require_LRANGE();
  var LREM = require_LREM();
  var LSET = require_LSET();
  var LTRIM = require_LTRIM();
  var MGET = require_MGET();
  var MIGRATE = require_MIGRATE();
  var MSET = require_MSET();
  var MSETNX = require_MSETNX();
  var OBJECT_ENCODING = require_OBJECT_ENCODING();
  var OBJECT_FREQ = require_OBJECT_FREQ();
  var OBJECT_IDLETIME = require_OBJECT_IDLETIME();
  var OBJECT_REFCOUNT = require_OBJECT_REFCOUNT();
  var PERSIST = require_PERSIST();
  var PEXPIRE = require_PEXPIRE();
  var PEXPIREAT = require_PEXPIREAT();
  var PEXPIRETIME = require_PEXPIRETIME();
  var PFADD = require_PFADD();
  var PFCOUNT = require_PFCOUNT();
  var PFMERGE = require_PFMERGE();
  var PSETEX = require_PSETEX();
  var PTTL = require_PTTL();
  var PUBLISH = require_PUBLISH();
  var RENAME = require_RENAME();
  var RENAMENX = require_RENAMENX();
  var RESTORE = require_RESTORE();
  var RPOP_COUNT = require_RPOP_COUNT();
  var RPOP = require_RPOP();
  var RPOPLPUSH = require_RPOPLPUSH();
  var RPUSH = require_RPUSH();
  var RPUSHX = require_RPUSHX();
  var SADD = require_SADD();
  var SCARD = require_SCARD();
  var SDIFF = require_SDIFF();
  var SDIFFSTORE = require_SDIFFSTORE();
  var SET = require_SET();
  var SETBIT = require_SETBIT();
  var SETEX = require_SETEX();
  var SETNX = require_SETNX();
  var SETRANGE = require_SETRANGE();
  var SINTER = require_SINTER();
  var SINTERCARD = require_SINTERCARD();
  var SINTERSTORE = require_SINTERSTORE();
  var SISMEMBER = require_SISMEMBER();
  var SMEMBERS = require_SMEMBERS();
  var SMISMEMBER = require_SMISMEMBER();
  var SMOVE = require_SMOVE();
  var SORT_RO = require_SORT_RO();
  var SORT_STORE = require_SORT_STORE();
  var SORT = require_SORT();
  var SPOP = require_SPOP();
  var SPUBLISH = require_SPUBLISH();
  var SRANDMEMBER_COUNT = require_SRANDMEMBER_COUNT();
  var SRANDMEMBER = require_SRANDMEMBER();
  var SREM = require_SREM();
  var SSCAN = require_SSCAN();
  var STRLEN = require_STRLEN();
  var SUNION = require_SUNION();
  var SUNIONSTORE = require_SUNIONSTORE();
  var TOUCH = require_TOUCH();
  var TTL = require_TTL();
  var TYPE = require_TYPE();
  var UNLINK = require_UNLINK();
  var WATCH = require_WATCH();
  var XACK = require_XACK();
  var XADD = require_XADD();
  var XAUTOCLAIM_JUSTID = require_XAUTOCLAIM_JUSTID();
  var XAUTOCLAIM = require_XAUTOCLAIM();
  var XCLAIM_JUSTID = require_XCLAIM_JUSTID();
  var XCLAIM = require_XCLAIM();
  var XDEL = require_XDEL();
  var XGROUP_CREATE = require_XGROUP_CREATE();
  var XGROUP_CREATECONSUMER = require_XGROUP_CREATECONSUMER();
  var XGROUP_DELCONSUMER = require_XGROUP_DELCONSUMER();
  var XGROUP_DESTROY = require_XGROUP_DESTROY();
  var XGROUP_SETID = require_XGROUP_SETID();
  var XINFO_CONSUMERS = require_XINFO_CONSUMERS();
  var XINFO_GROUPS = require_XINFO_GROUPS();
  var XINFO_STREAM = require_XINFO_STREAM();
  var XLEN = require_XLEN();
  var XPENDING_RANGE = require_XPENDING_RANGE();
  var XPENDING = require_XPENDING();
  var XRANGE = require_XRANGE();
  var XREAD = require_XREAD();
  var XREADGROUP = require_XREADGROUP();
  var XREVRANGE = require_XREVRANGE();
  var XSETID = require_XSETID();
  var XTRIM = require_XTRIM();
  var ZADD = require_ZADD();
  var ZCARD = require_ZCARD();
  var ZCOUNT = require_ZCOUNT();
  var ZDIFF_WITHSCORES = require_ZDIFF_WITHSCORES();
  var ZDIFF = require_ZDIFF();
  var ZDIFFSTORE = require_ZDIFFSTORE();
  var ZINCRBY = require_ZINCRBY();
  var ZINTER_WITHSCORES = require_ZINTER_WITHSCORES();
  var ZINTER = require_ZINTER();
  var ZINTERCARD = require_ZINTERCARD();
  var ZINTERSTORE = require_ZINTERSTORE();
  var ZLEXCOUNT = require_ZLEXCOUNT();
  var ZMPOP = require_ZMPOP();
  var ZMSCORE = require_ZMSCORE();
  var ZPOPMAX_COUNT = require_ZPOPMAX_COUNT();
  var ZPOPMAX = require_ZPOPMAX();
  var ZPOPMIN_COUNT = require_ZPOPMIN_COUNT();
  var ZPOPMIN = require_ZPOPMIN();
  var ZRANDMEMBER_COUNT_WITHSCORES = require_ZRANDMEMBER_COUNT_WITHSCORES();
  var ZRANDMEMBER_COUNT = require_ZRANDMEMBER_COUNT();
  var ZRANDMEMBER = require_ZRANDMEMBER();
  var ZRANGE_WITHSCORES = require_ZRANGE_WITHSCORES();
  var ZRANGE = require_ZRANGE();
  var ZRANGEBYLEX = require_ZRANGEBYLEX();
  var ZRANGEBYSCORE_WITHSCORES = require_ZRANGEBYSCORE_WITHSCORES();
  var ZRANGEBYSCORE = require_ZRANGEBYSCORE();
  var ZRANGESTORE = require_ZRANGESTORE();
  var ZRANK = require_ZRANK();
  var ZREM = require_ZREM();
  var ZREMRANGEBYLEX = require_ZREMRANGEBYLEX();
  var ZREMRANGEBYRANK = require_ZREMRANGEBYRANK();
  var ZREMRANGEBYSCORE = require_ZREMRANGEBYSCORE();
  var ZREVRANK = require_ZREVRANK();
  var ZSCAN = require_ZSCAN();
  var ZSCORE = require_ZSCORE();
  var ZUNION_WITHSCORES = require_ZUNION_WITHSCORES();
  var ZUNION = require_ZUNION();
  var ZUNIONSTORE = require_ZUNIONSTORE();
  exports.default = {
    APPEND,
    append: APPEND,
    BITCOUNT,
    bitCount: BITCOUNT,
    BITFIELD_RO,
    bitFieldRo: BITFIELD_RO,
    BITFIELD,
    bitField: BITFIELD,
    BITOP,
    bitOp: BITOP,
    BITPOS,
    bitPos: BITPOS,
    BLMOVE,
    blMove: BLMOVE,
    BLMPOP,
    blmPop: BLMPOP,
    BLPOP,
    blPop: BLPOP,
    BRPOP,
    brPop: BRPOP,
    BRPOPLPUSH,
    brPopLPush: BRPOPLPUSH,
    BZMPOP,
    bzmPop: BZMPOP,
    BZPOPMAX,
    bzPopMax: BZPOPMAX,
    BZPOPMIN,
    bzPopMin: BZPOPMIN,
    COPY,
    copy: COPY,
    DECR,
    decr: DECR,
    DECRBY,
    decrBy: DECRBY,
    DEL,
    del: DEL,
    DUMP,
    dump: DUMP,
    EVAL_RO,
    evalRo: EVAL_RO,
    EVAL,
    eval: EVAL,
    EVALSHA,
    evalSha: EVALSHA,
    EVALSHA_RO,
    evalShaRo: EVALSHA_RO,
    EXISTS,
    exists: EXISTS,
    EXPIRE,
    expire: EXPIRE,
    EXPIREAT,
    expireAt: EXPIREAT,
    EXPIRETIME,
    expireTime: EXPIRETIME,
    FCALL_RO,
    fCallRo: FCALL_RO,
    FCALL,
    fCall: FCALL,
    GEOADD,
    geoAdd: GEOADD,
    GEODIST,
    geoDist: GEODIST,
    GEOHASH,
    geoHash: GEOHASH,
    GEOPOS,
    geoPos: GEOPOS,
    GEORADIUS_RO_WITH,
    geoRadiusRoWith: GEORADIUS_RO_WITH,
    GEORADIUS_RO,
    geoRadiusRo: GEORADIUS_RO,
    GEORADIUS_WITH,
    geoRadiusWith: GEORADIUS_WITH,
    GEORADIUS,
    geoRadius: GEORADIUS,
    GEORADIUSBYMEMBER_RO_WITH,
    geoRadiusByMemberRoWith: GEORADIUSBYMEMBER_RO_WITH,
    GEORADIUSBYMEMBER_RO,
    geoRadiusByMemberRo: GEORADIUSBYMEMBER_RO,
    GEORADIUSBYMEMBER_WITH,
    geoRadiusByMemberWith: GEORADIUSBYMEMBER_WITH,
    GEORADIUSBYMEMBER,
    geoRadiusByMember: GEORADIUSBYMEMBER,
    GEORADIUSBYMEMBERSTORE,
    geoRadiusByMemberStore: GEORADIUSBYMEMBERSTORE,
    GEORADIUSSTORE,
    geoRadiusStore: GEORADIUSSTORE,
    GEOSEARCH_WITH,
    geoSearchWith: GEOSEARCH_WITH,
    GEOSEARCH,
    geoSearch: GEOSEARCH,
    GEOSEARCHSTORE,
    geoSearchStore: GEOSEARCHSTORE,
    GET,
    get: GET,
    GETBIT,
    getBit: GETBIT,
    GETDEL,
    getDel: GETDEL,
    GETEX,
    getEx: GETEX,
    GETRANGE,
    getRange: GETRANGE,
    GETSET,
    getSet: GETSET,
    HDEL,
    hDel: HDEL,
    HEXISTS,
    hExists: HEXISTS,
    HEXPIRE,
    hExpire: HEXPIRE,
    HEXPIREAT,
    hExpireAt: HEXPIREAT,
    HEXPIRETIME,
    hExpireTime: HEXPIRETIME,
    HGET,
    hGet: HGET,
    HGETALL,
    hGetAll: HGETALL,
    HINCRBY,
    hIncrBy: HINCRBY,
    HINCRBYFLOAT,
    hIncrByFloat: HINCRBYFLOAT,
    HKEYS,
    hKeys: HKEYS,
    HLEN,
    hLen: HLEN,
    HMGET,
    hmGet: HMGET,
    HPERSIST,
    hPersist: HPERSIST,
    HPEXPIRE,
    hpExpire: HPEXPIRE,
    HPEXPIREAT,
    hpExpireAt: HPEXPIREAT,
    HPEXPIRETIME,
    hpExpireTime: HPEXPIRETIME,
    HPTTL,
    hpTTL: HPTTL,
    HRANDFIELD_COUNT_WITHVALUES,
    hRandFieldCountWithValues: HRANDFIELD_COUNT_WITHVALUES,
    HRANDFIELD_COUNT,
    hRandFieldCount: HRANDFIELD_COUNT,
    HRANDFIELD,
    hRandField: HRANDFIELD,
    HSCAN,
    hScan: HSCAN,
    HSCAN_NOVALUES,
    hScanNoValues: HSCAN_NOVALUES,
    HSET,
    hSet: HSET,
    HSETNX,
    hSetNX: HSETNX,
    HSTRLEN,
    hStrLen: HSTRLEN,
    HTTL,
    hTTL: HTTL,
    HVALS,
    hVals: HVALS,
    INCR,
    incr: INCR,
    INCRBY,
    incrBy: INCRBY,
    INCRBYFLOAT,
    incrByFloat: INCRBYFLOAT,
    LCS_IDX_WITHMATCHLEN,
    lcsIdxWithMatchLen: LCS_IDX_WITHMATCHLEN,
    LCS_IDX,
    lcsIdx: LCS_IDX,
    LCS_LEN,
    lcsLen: LCS_LEN,
    LCS,
    lcs: LCS,
    LINDEX,
    lIndex: LINDEX,
    LINSERT,
    lInsert: LINSERT,
    LLEN,
    lLen: LLEN,
    LMOVE,
    lMove: LMOVE,
    LMPOP,
    lmPop: LMPOP,
    LPOP_COUNT,
    lPopCount: LPOP_COUNT,
    LPOP,
    lPop: LPOP,
    LPOS_COUNT,
    lPosCount: LPOS_COUNT,
    LPOS,
    lPos: LPOS,
    LPUSH,
    lPush: LPUSH,
    LPUSHX,
    lPushX: LPUSHX,
    LRANGE,
    lRange: LRANGE,
    LREM,
    lRem: LREM,
    LSET,
    lSet: LSET,
    LTRIM,
    lTrim: LTRIM,
    MGET,
    mGet: MGET,
    MIGRATE,
    migrate: MIGRATE,
    MSET,
    mSet: MSET,
    MSETNX,
    mSetNX: MSETNX,
    OBJECT_ENCODING,
    objectEncoding: OBJECT_ENCODING,
    OBJECT_FREQ,
    objectFreq: OBJECT_FREQ,
    OBJECT_IDLETIME,
    objectIdleTime: OBJECT_IDLETIME,
    OBJECT_REFCOUNT,
    objectRefCount: OBJECT_REFCOUNT,
    PERSIST,
    persist: PERSIST,
    PEXPIRE,
    pExpire: PEXPIRE,
    PEXPIREAT,
    pExpireAt: PEXPIREAT,
    PEXPIRETIME,
    pExpireTime: PEXPIRETIME,
    PFADD,
    pfAdd: PFADD,
    PFCOUNT,
    pfCount: PFCOUNT,
    PFMERGE,
    pfMerge: PFMERGE,
    PSETEX,
    pSetEx: PSETEX,
    PTTL,
    pTTL: PTTL,
    PUBLISH,
    publish: PUBLISH,
    RENAME,
    rename: RENAME,
    RENAMENX,
    renameNX: RENAMENX,
    RESTORE,
    restore: RESTORE,
    RPOP_COUNT,
    rPopCount: RPOP_COUNT,
    RPOP,
    rPop: RPOP,
    RPOPLPUSH,
    rPopLPush: RPOPLPUSH,
    RPUSH,
    rPush: RPUSH,
    RPUSHX,
    rPushX: RPUSHX,
    SADD,
    sAdd: SADD,
    SCARD,
    sCard: SCARD,
    SDIFF,
    sDiff: SDIFF,
    SDIFFSTORE,
    sDiffStore: SDIFFSTORE,
    SINTER,
    sInter: SINTER,
    SINTERCARD,
    sInterCard: SINTERCARD,
    SINTERSTORE,
    sInterStore: SINTERSTORE,
    SET,
    set: SET,
    SETBIT,
    setBit: SETBIT,
    SETEX,
    setEx: SETEX,
    SETNX,
    setNX: SETNX,
    SETRANGE,
    setRange: SETRANGE,
    SISMEMBER,
    sIsMember: SISMEMBER,
    SMEMBERS,
    sMembers: SMEMBERS,
    SMISMEMBER,
    smIsMember: SMISMEMBER,
    SMOVE,
    sMove: SMOVE,
    SORT_RO,
    sortRo: SORT_RO,
    SORT_STORE,
    sortStore: SORT_STORE,
    SORT,
    sort: SORT,
    SPOP,
    sPop: SPOP,
    SPUBLISH,
    sPublish: SPUBLISH,
    SRANDMEMBER_COUNT,
    sRandMemberCount: SRANDMEMBER_COUNT,
    SRANDMEMBER,
    sRandMember: SRANDMEMBER,
    SREM,
    sRem: SREM,
    SSCAN,
    sScan: SSCAN,
    STRLEN,
    strLen: STRLEN,
    SUNION,
    sUnion: SUNION,
    SUNIONSTORE,
    sUnionStore: SUNIONSTORE,
    TOUCH,
    touch: TOUCH,
    TTL,
    ttl: TTL,
    TYPE,
    type: TYPE,
    UNLINK,
    unlink: UNLINK,
    WATCH,
    watch: WATCH,
    XACK,
    xAck: XACK,
    XADD,
    xAdd: XADD,
    XAUTOCLAIM_JUSTID,
    xAutoClaimJustId: XAUTOCLAIM_JUSTID,
    XAUTOCLAIM,
    xAutoClaim: XAUTOCLAIM,
    XCLAIM,
    xClaim: XCLAIM,
    XCLAIM_JUSTID,
    xClaimJustId: XCLAIM_JUSTID,
    XDEL,
    xDel: XDEL,
    XGROUP_CREATE,
    xGroupCreate: XGROUP_CREATE,
    XGROUP_CREATECONSUMER,
    xGroupCreateConsumer: XGROUP_CREATECONSUMER,
    XGROUP_DELCONSUMER,
    xGroupDelConsumer: XGROUP_DELCONSUMER,
    XGROUP_DESTROY,
    xGroupDestroy: XGROUP_DESTROY,
    XGROUP_SETID,
    xGroupSetId: XGROUP_SETID,
    XINFO_CONSUMERS,
    xInfoConsumers: XINFO_CONSUMERS,
    XINFO_GROUPS,
    xInfoGroups: XINFO_GROUPS,
    XINFO_STREAM,
    xInfoStream: XINFO_STREAM,
    XLEN,
    xLen: XLEN,
    XPENDING_RANGE,
    xPendingRange: XPENDING_RANGE,
    XPENDING,
    xPending: XPENDING,
    XRANGE,
    xRange: XRANGE,
    XREAD,
    xRead: XREAD,
    XREADGROUP,
    xReadGroup: XREADGROUP,
    XREVRANGE,
    xRevRange: XREVRANGE,
    XSETID,
    xSetId: XSETID,
    XTRIM,
    xTrim: XTRIM,
    ZADD,
    zAdd: ZADD,
    ZCARD,
    zCard: ZCARD,
    ZCOUNT,
    zCount: ZCOUNT,
    ZDIFF_WITHSCORES,
    zDiffWithScores: ZDIFF_WITHSCORES,
    ZDIFF,
    zDiff: ZDIFF,
    ZDIFFSTORE,
    zDiffStore: ZDIFFSTORE,
    ZINCRBY,
    zIncrBy: ZINCRBY,
    ZINTER_WITHSCORES,
    zInterWithScores: ZINTER_WITHSCORES,
    ZINTER,
    zInter: ZINTER,
    ZINTERCARD,
    zInterCard: ZINTERCARD,
    ZINTERSTORE,
    zInterStore: ZINTERSTORE,
    ZLEXCOUNT,
    zLexCount: ZLEXCOUNT,
    ZMPOP,
    zmPop: ZMPOP,
    ZMSCORE,
    zmScore: ZMSCORE,
    ZPOPMAX_COUNT,
    zPopMaxCount: ZPOPMAX_COUNT,
    ZPOPMAX,
    zPopMax: ZPOPMAX,
    ZPOPMIN_COUNT,
    zPopMinCount: ZPOPMIN_COUNT,
    ZPOPMIN,
    zPopMin: ZPOPMIN,
    ZRANDMEMBER_COUNT_WITHSCORES,
    zRandMemberCountWithScores: ZRANDMEMBER_COUNT_WITHSCORES,
    ZRANDMEMBER_COUNT,
    zRandMemberCount: ZRANDMEMBER_COUNT,
    ZRANDMEMBER,
    zRandMember: ZRANDMEMBER,
    ZRANGE_WITHSCORES,
    zRangeWithScores: ZRANGE_WITHSCORES,
    ZRANGE,
    zRange: ZRANGE,
    ZRANGEBYLEX,
    zRangeByLex: ZRANGEBYLEX,
    ZRANGEBYSCORE_WITHSCORES,
    zRangeByScoreWithScores: ZRANGEBYSCORE_WITHSCORES,
    ZRANGEBYSCORE,
    zRangeByScore: ZRANGEBYSCORE,
    ZRANGESTORE,
    zRangeStore: ZRANGESTORE,
    ZRANK,
    zRank: ZRANK,
    ZREM,
    zRem: ZREM,
    ZREMRANGEBYLEX,
    zRemRangeByLex: ZREMRANGEBYLEX,
    ZREMRANGEBYRANK,
    zRemRangeByRank: ZREMRANGEBYRANK,
    ZREMRANGEBYSCORE,
    zRemRangeByScore: ZREMRANGEBYSCORE,
    ZREVRANK,
    zRevRank: ZREVRANK,
    ZSCAN,
    zScan: ZSCAN,
    ZSCORE,
    zScore: ZSCORE,
    ZUNION_WITHSCORES,
    zUnionWithScores: ZUNION_WITHSCORES,
    ZUNION,
    zUnion: ZUNION,
    ZUNIONSTORE,
    zUnionStore: ZUNIONSTORE
  };
});

// node_modules/@redis/client/dist/lib/commands/ACL_CAT.js
var require_ACL_CAT = __commonJS((exports) => {
  function transformArguments(categoryName) {
    const args = ["ACL", "CAT"];
    if (categoryName) {
      args.push(categoryName);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_DELUSER.js
var require_ACL_DELUSER = __commonJS((exports) => {
  function transformArguments(username) {
    return (0, generic_transformers_1.pushVerdictArguments)(["ACL", "DELUSER"], username);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_DRYRUN.js
var require_ACL_DRYRUN = __commonJS((exports) => {
  function transformArguments(username, command) {
    return [
      "ACL",
      "DRYRUN",
      username,
      ...command
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_GENPASS.js
var require_ACL_GENPASS = __commonJS((exports) => {
  function transformArguments(bits) {
    const args = ["ACL", "GENPASS"];
    if (bits) {
      args.push(bits.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_GETUSER.js
var require_ACL_GETUSER = __commonJS((exports) => {
  function transformArguments(username) {
    return ["ACL", "GETUSER", username];
  }
  function transformReply(reply) {
    return {
      flags: reply[1],
      passwords: reply[3],
      commands: reply[5],
      keys: reply[7],
      channels: reply[9],
      selectors: reply[11]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/ACL_LIST.js
var require_ACL_LIST = __commonJS((exports) => {
  function transformArguments() {
    return ["ACL", "LIST"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_LOAD.js
var require_ACL_LOAD = __commonJS((exports) => {
  function transformArguments() {
    return ["ACL", "LOAD"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_LOG_RESET.js
var require_ACL_LOG_RESET = __commonJS((exports) => {
  function transformArguments() {
    return ["ACL", "LOG", "RESET"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_LOG.js
var require_ACL_LOG = __commonJS((exports) => {
  function transformArguments(count) {
    const args = ["ACL", "LOG"];
    if (count) {
      args.push(count.toString());
    }
    return args;
  }
  function transformReply(reply) {
    return reply.map((log2) => ({
      count: log2[1],
      reason: log2[3],
      context: log2[5],
      object: log2[7],
      username: log2[9],
      ageSeconds: Number(log2[11]),
      clientInfo: log2[13]
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/ACL_SAVE.js
var require_ACL_SAVE = __commonJS((exports) => {
  function transformArguments() {
    return ["ACL", "SAVE"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_SETUSER.js
var require_ACL_SETUSER = __commonJS((exports) => {
  function transformArguments(username, rule) {
    return (0, generic_transformers_1.pushVerdictArguments)(["ACL", "SETUSER", username], rule);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_USERS.js
var require_ACL_USERS = __commonJS((exports) => {
  function transformArguments() {
    return ["ACL", "USERS"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ACL_WHOAMI.js
var require_ACL_WHOAMI = __commonJS((exports) => {
  function transformArguments() {
    return ["ACL", "WHOAMI"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ASKING.js
var require_ASKING = __commonJS((exports) => {
  function transformArguments() {
    return ["ASKING"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/AUTH.js
var require_AUTH = __commonJS((exports) => {
  function transformArguments({ username, password }) {
    if (!username) {
      return ["AUTH", password];
    }
    return ["AUTH", username, password];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BGREWRITEAOF.js
var require_BGREWRITEAOF = __commonJS((exports) => {
  function transformArguments() {
    return ["BGREWRITEAOF"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/BGSAVE.js
var require_BGSAVE = __commonJS((exports) => {
  function transformArguments(options) {
    const args = ["BGSAVE"];
    if (options?.SCHEDULE) {
      args.push("SCHEDULE");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_CACHING.js
var require_CLIENT_CACHING = __commonJS((exports) => {
  function transformArguments(value) {
    return [
      "CLIENT",
      "CACHING",
      value ? "YES" : "NO"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_GETNAME.js
var require_CLIENT_GETNAME = __commonJS((exports) => {
  function transformArguments() {
    return ["CLIENT", "GETNAME"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_GETREDIR.js
var require_CLIENT_GETREDIR = __commonJS((exports) => {
  function transformArguments() {
    return ["CLIENT", "GETREDIR"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_ID.js
var require_CLIENT_ID = __commonJS((exports) => {
  function transformArguments() {
    return ["CLIENT", "ID"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_KILL.js
var require_CLIENT_KILL = __commonJS((exports) => {
  function transformArguments(filters) {
    const args = ["CLIENT", "KILL"];
    if (Array.isArray(filters)) {
      for (const filter of filters) {
        pushFilter(args, filter);
      }
    } else {
      pushFilter(args, filters);
    }
    return args;
  }
  function pushFilter(args, filter) {
    if (filter === ClientKillFilters.SKIP_ME) {
      args.push("SKIPME");
      return;
    }
    args.push(filter.filter);
    switch (filter.filter) {
      case ClientKillFilters.ADDRESS:
        args.push(filter.address);
        break;
      case ClientKillFilters.LOCAL_ADDRESS:
        args.push(filter.localAddress);
        break;
      case ClientKillFilters.ID:
        args.push(typeof filter.id === "number" ? filter.id.toString() : filter.id);
        break;
      case ClientKillFilters.TYPE:
        args.push(filter.type);
        break;
      case ClientKillFilters.USER:
        args.push(filter.username);
        break;
      case ClientKillFilters.SKIP_ME:
        args.push(filter.skipMe ? "yes" : "no");
        break;
      case ClientKillFilters.MAXAGE:
        args.push(filter.maxAge.toString());
        break;
    }
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.ClientKillFilters = undefined;
  var ClientKillFilters;
  (function(ClientKillFilters2) {
    ClientKillFilters2["ADDRESS"] = "ADDR";
    ClientKillFilters2["LOCAL_ADDRESS"] = "LADDR";
    ClientKillFilters2["ID"] = "ID";
    ClientKillFilters2["TYPE"] = "TYPE";
    ClientKillFilters2["USER"] = "USER";
    ClientKillFilters2["SKIP_ME"] = "SKIPME";
    ClientKillFilters2["MAXAGE"] = "MAXAGE";
  })(ClientKillFilters || (exports.ClientKillFilters = ClientKillFilters = {}));
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_INFO.js
var require_CLIENT_INFO = __commonJS((exports) => {
  function transformArguments() {
    return ["CLIENT", "INFO"];
  }
  function transformReply(rawReply) {
    const map = {};
    for (const item of rawReply.matchAll(CLIENT_INFO_REGEX)) {
      map[item[1]] = item[2];
    }
    const reply = {
      id: Number(map.id),
      addr: map.addr,
      fd: Number(map.fd),
      name: map.name,
      age: Number(map.age),
      idle: Number(map.idle),
      flags: map.flags,
      db: Number(map.db),
      sub: Number(map.sub),
      psub: Number(map.psub),
      multi: Number(map.multi),
      qbuf: Number(map.qbuf),
      qbufFree: Number(map["qbuf-free"]),
      argvMem: Number(map["argv-mem"]),
      obl: Number(map.obl),
      oll: Number(map.oll),
      omem: Number(map.omem),
      totMem: Number(map["tot-mem"]),
      events: map.events,
      cmd: map.cmd,
      user: map.user,
      libName: map["lib-name"],
      libVer: map["lib-ver"]
    };
    if (map.laddr !== undefined) {
      reply.laddr = map.laddr;
    }
    if (map.redir !== undefined) {
      reply.redir = Number(map.redir);
    }
    if (map.ssub !== undefined) {
      reply.ssub = Number(map.ssub);
    }
    if (map["multi-mem"] !== undefined) {
      reply.multiMem = Number(map["multi-mem"]);
    }
    if (map.resp !== undefined) {
      reply.resp = Number(map.resp);
    }
    return reply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var CLIENT_INFO_REGEX = /([^\s=]+)=([^\s]*)/g;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_LIST.js
var require_CLIENT_LIST = __commonJS((exports) => {
  function transformArguments(filter) {
    let args = ["CLIENT", "LIST"];
    if (filter) {
      if (filter.TYPE !== undefined) {
        args.push("TYPE", filter.TYPE);
      } else {
        args.push("ID");
        args = (0, generic_transformers_1.pushVerdictArguments)(args, filter.ID);
      }
    }
    return args;
  }
  function transformReply(rawReply) {
    const split = rawReply.split("\n"), length = split.length - 1, reply = [];
    for (let i = 0;i < length; i++) {
      reply.push((0, CLIENT_INFO_1.transformReply)(split[i]));
    }
    return reply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var CLIENT_INFO_1 = require_CLIENT_INFO();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_NO-EVICT.js
var require_CLIENT_NO_EVICT = __commonJS((exports) => {
  function transformArguments(value) {
    return [
      "CLIENT",
      "NO-EVICT",
      value ? "ON" : "OFF"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_NO-TOUCH.js
var require_CLIENT_NO_TOUCH = __commonJS((exports) => {
  function transformArguments(value) {
    return [
      "CLIENT",
      "NO-TOUCH",
      value ? "ON" : "OFF"
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_PAUSE.js
var require_CLIENT_PAUSE = __commonJS((exports) => {
  function transformArguments(timeout, mode) {
    const args = [
      "CLIENT",
      "PAUSE",
      timeout.toString()
    ];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_SETNAME.js
var require_CLIENT_SETNAME = __commonJS((exports) => {
  function transformArguments(name) {
    return ["CLIENT", "SETNAME", name];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_TRACKING.js
var require_CLIENT_TRACKING = __commonJS((exports) => {
  function transformArguments(mode, options) {
    const args = [
      "CLIENT",
      "TRACKING",
      mode ? "ON" : "OFF"
    ];
    if (mode) {
      if (options?.REDIRECT) {
        args.push("REDIRECT", options.REDIRECT.toString());
      }
      if (isBroadcast(options)) {
        args.push("BCAST");
        if (options?.PREFIX) {
          if (Array.isArray(options.PREFIX)) {
            for (const prefix of options.PREFIX) {
              args.push("PREFIX", prefix);
            }
          } else {
            args.push("PREFIX", options.PREFIX);
          }
        }
      } else if (isOptIn(options)) {
        args.push("OPTIN");
      } else if (isOptOut(options)) {
        args.push("OPTOUT");
      }
      if (options?.NOLOOP) {
        args.push("NOLOOP");
      }
    }
    return args;
  }
  function isBroadcast(options) {
    return options?.BCAST === true;
  }
  function isOptIn(options) {
    return options?.OPTIN === true;
  }
  function isOptOut(options) {
    return options?.OPTOUT === true;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_TRACKINGINFO.js
var require_CLIENT_TRACKINGINFO = __commonJS((exports) => {
  function transformArguments() {
    return ["CLIENT", "TRACKINGINFO"];
  }
  function transformReply(reply) {
    return {
      flags: new Set(reply[1]),
      redirect: reply[3],
      prefixes: reply[5]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/CLIENT_UNPAUSE.js
var require_CLIENT_UNPAUSE = __commonJS((exports) => {
  function transformArguments() {
    return ["CLIENT", "UNPAUSE"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_ADDSLOTS.js
var require_CLUSTER_ADDSLOTS = __commonJS((exports) => {
  function transformArguments(slots) {
    return (0, generic_transformers_1.pushVerdictNumberArguments)(["CLUSTER", "ADDSLOTS"], slots);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_ADDSLOTSRANGE.js
var require_CLUSTER_ADDSLOTSRANGE = __commonJS((exports) => {
  function transformArguments(ranges) {
    return (0, generic_transformers_1.pushSlotRangesArguments)(["CLUSTER", "ADDSLOTSRANGE"], ranges);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_BUMPEPOCH.js
var require_CLUSTER_BUMPEPOCH = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "BUMPEPOCH"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_COUNT-FAILURE-REPORTS.js
var require_CLUSTER_COUNT_FAILURE_REPORTS = __commonJS((exports) => {
  function transformArguments(nodeId) {
    return ["CLUSTER", "COUNT-FAILURE-REPORTS", nodeId];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_COUNTKEYSINSLOT.js
var require_CLUSTER_COUNTKEYSINSLOT = __commonJS((exports) => {
  function transformArguments(slot) {
    return ["CLUSTER", "COUNTKEYSINSLOT", slot.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_DELSLOTS.js
var require_CLUSTER_DELSLOTS = __commonJS((exports) => {
  function transformArguments(slots) {
    return (0, generic_transformers_1.pushVerdictNumberArguments)(["CLUSTER", "DELSLOTS"], slots);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_DELSLOTSRANGE.js
var require_CLUSTER_DELSLOTSRANGE = __commonJS((exports) => {
  function transformArguments(ranges) {
    return (0, generic_transformers_1.pushSlotRangesArguments)(["CLUSTER", "DELSLOTSRANGE"], ranges);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_FAILOVER.js
var require_CLUSTER_FAILOVER = __commonJS((exports) => {
  function transformArguments(mode) {
    const args = ["CLUSTER", "FAILOVER"];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FailoverModes = undefined;
  var FailoverModes;
  (function(FailoverModes2) {
    FailoverModes2["FORCE"] = "FORCE";
    FailoverModes2["TAKEOVER"] = "TAKEOVER";
  })(FailoverModes || (exports.FailoverModes = FailoverModes = {}));
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_FLUSHSLOTS.js
var require_CLUSTER_FLUSHSLOTS = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "FLUSHSLOTS"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_FORGET.js
var require_CLUSTER_FORGET = __commonJS((exports) => {
  function transformArguments(nodeId) {
    return ["CLUSTER", "FORGET", nodeId];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_GETKEYSINSLOT.js
var require_CLUSTER_GETKEYSINSLOT = __commonJS((exports) => {
  function transformArguments(slot, count) {
    return ["CLUSTER", "GETKEYSINSLOT", slot.toString(), count.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_INFO.js
var require_CLUSTER_INFO = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "INFO"];
  }
  function transformReply(reply) {
    const lines = reply.split("\r\n");
    return {
      state: extractLineValue(lines[0]),
      slots: {
        assigned: Number(extractLineValue(lines[1])),
        ok: Number(extractLineValue(lines[2])),
        pfail: Number(extractLineValue(lines[3])),
        fail: Number(extractLineValue(lines[4]))
      },
      knownNodes: Number(extractLineValue(lines[5])),
      size: Number(extractLineValue(lines[6])),
      currentEpoch: Number(extractLineValue(lines[7])),
      myEpoch: Number(extractLineValue(lines[8])),
      stats: {
        messagesSent: Number(extractLineValue(lines[9])),
        messagesReceived: Number(extractLineValue(lines[10]))
      }
    };
  }
  function extractLineValue(line) {
    return line.substring(line.indexOf(":") + 1);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.extractLineValue = exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
  exports.extractLineValue = extractLineValue;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_KEYSLOT.js
var require_CLUSTER_KEYSLOT = __commonJS((exports) => {
  function transformArguments(key) {
    return ["CLUSTER", "KEYSLOT", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_LINKS.js
var require_CLUSTER_LINKS = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "LINKS"];
  }
  function transformReply(reply) {
    return reply.map((peerLink) => ({
      direction: peerLink[1],
      node: peerLink[3],
      createTime: Number(peerLink[5]),
      events: peerLink[7],
      sendBufferAllocated: Number(peerLink[9]),
      sendBufferUsed: Number(peerLink[11])
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_MEET.js
var require_CLUSTER_MEET = __commonJS((exports) => {
  function transformArguments(ip, port) {
    return ["CLUSTER", "MEET", ip, port.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_MYID.js
var require_CLUSTER_MYID = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "MYID"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_MYSHARDID.js
var require_CLUSTER_MYSHARDID = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "MYSHARDID"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_NODES.js
var require_CLUSTER_NODES = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "NODES"];
  }
  function transformReply(reply) {
    const lines = reply.split("\n");
    lines.pop();
    const mastersMap = new Map, replicasMap = new Map;
    for (const line of lines) {
      const [id, address, flags, masterId, pingSent, pongRecv, configEpoch, linkState, ...slots] = line.split(" "), node4 = {
        id,
        address,
        ...transformNodeAddress(address),
        flags: flags.split(","),
        pingSent: Number(pingSent),
        pongRecv: Number(pongRecv),
        configEpoch: Number(configEpoch),
        linkState
      };
      if (masterId === "-") {
        let replicas = replicasMap.get(id);
        if (!replicas) {
          replicas = [];
          replicasMap.set(id, replicas);
        }
        mastersMap.set(id, {
          ...node4,
          slots: slots.map((slot) => {
            const [fromString, toString] = slot.split("-", 2), from = Number(fromString);
            return {
              from,
              to: toString ? Number(toString) : from
            };
          }),
          replicas
        });
      } else {
        const replicas = replicasMap.get(masterId);
        if (!replicas) {
          replicasMap.set(masterId, [node4]);
        } else {
          replicas.push(node4);
        }
      }
    }
    return [...mastersMap.values()];
  }
  function transformNodeAddress(address) {
    const indexOfColon = address.lastIndexOf(":"), indexOfAt = address.indexOf("@", indexOfColon), host = address.substring(0, indexOfColon);
    if (indexOfAt === -1) {
      return {
        host,
        port: Number(address.substring(indexOfColon + 1)),
        cport: null
      };
    }
    return {
      host: address.substring(0, indexOfColon),
      port: Number(address.substring(indexOfColon + 1, indexOfAt)),
      cport: Number(address.substring(indexOfAt + 1))
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.RedisClusterNodeLinkStates = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  var RedisClusterNodeLinkStates;
  (function(RedisClusterNodeLinkStates2) {
    RedisClusterNodeLinkStates2["CONNECTED"] = "connected";
    RedisClusterNodeLinkStates2["DISCONNECTED"] = "disconnected";
  })(RedisClusterNodeLinkStates || (exports.RedisClusterNodeLinkStates = RedisClusterNodeLinkStates = {}));
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_REPLICAS.js
var require_CLUSTER_REPLICAS = __commonJS((exports) => {
  function transformArguments(nodeId) {
    return ["CLUSTER", "REPLICAS", nodeId];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  var CLUSTER_NODES_1 = require_CLUSTER_NODES();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return CLUSTER_NODES_1.transformReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_REPLICATE.js
var require_CLUSTER_REPLICATE = __commonJS((exports) => {
  function transformArguments(nodeId) {
    return ["CLUSTER", "REPLICATE", nodeId];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_RESET.js
var require_CLUSTER_RESET = __commonJS((exports) => {
  function transformArguments(mode) {
    const args = ["CLUSTER", "RESET"];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_SAVECONFIG.js
var require_CLUSTER_SAVECONFIG = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "SAVECONFIG"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_SET-CONFIG-EPOCH.js
var require_CLUSTER_SET_CONFIG_EPOCH = __commonJS((exports) => {
  function transformArguments(configEpoch) {
    return ["CLUSTER", "SET-CONFIG-EPOCH", configEpoch.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_SETSLOT.js
var require_CLUSTER_SETSLOT = __commonJS((exports) => {
  function transformArguments(slot, state, nodeId) {
    const args = ["CLUSTER", "SETSLOT", slot.toString(), state];
    if (nodeId) {
      args.push(nodeId);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.ClusterSlotStates = undefined;
  var ClusterSlotStates;
  (function(ClusterSlotStates2) {
    ClusterSlotStates2["IMPORTING"] = "IMPORTING";
    ClusterSlotStates2["MIGRATING"] = "MIGRATING";
    ClusterSlotStates2["STABLE"] = "STABLE";
    ClusterSlotStates2["NODE"] = "NODE";
  })(ClusterSlotStates || (exports.ClusterSlotStates = ClusterSlotStates = {}));
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CLUSTER_SLOTS.js
var require_CLUSTER_SLOTS = __commonJS((exports) => {
  function transformArguments() {
    return ["CLUSTER", "SLOTS"];
  }
  function transformReply(reply) {
    return reply.map(([from, to, master, ...replicas]) => {
      return {
        from,
        to,
        master: transformNode(master),
        replicas: replicas.map(transformNode)
      };
    });
  }
  function transformNode([ip, port, id]) {
    return {
      ip,
      port,
      id
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/COMMAND_COUNT.js
var require_COMMAND_COUNT = __commonJS((exports) => {
  function transformArguments() {
    return ["COMMAND", "COUNT"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/COMMAND_GETKEYS.js
var require_COMMAND_GETKEYS = __commonJS((exports) => {
  function transformArguments(args) {
    return ["COMMAND", "GETKEYS", ...args];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/COMMAND_GETKEYSANDFLAGS.js
var require_COMMAND_GETKEYSANDFLAGS = __commonJS((exports) => {
  function transformArguments(args) {
    return ["COMMAND", "GETKEYSANDFLAGS", ...args];
  }
  function transformReply(reply) {
    return reply.map(([key, flags]) => ({
      key,
      flags
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/COMMAND_INFO.js
var require_COMMAND_INFO = __commonJS((exports) => {
  function transformArguments(commands) {
    return ["COMMAND", "INFO", ...commands];
  }
  function transformReply(reply) {
    return reply.map((command) => command ? (0, generic_transformers_1.transformCommandReply)(command) : null);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/COMMAND_LIST.js
var require_COMMAND_LIST = __commonJS((exports) => {
  function transformArguments(filter) {
    const args = ["COMMAND", "LIST"];
    if (filter) {
      args.push("FILTERBY", filter.filterBy, filter.value);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FilterBy = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  var FilterBy;
  (function(FilterBy2) {
    FilterBy2["MODULE"] = "MODULE";
    FilterBy2["ACLCAT"] = "ACLCAT";
    FilterBy2["PATTERN"] = "PATTERN";
  })(FilterBy || (exports.FilterBy = FilterBy = {}));
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/COMMAND.js
var require_COMMAND = __commonJS((exports) => {
  function transformArguments() {
    return ["COMMAND"];
  }
  function transformReply(reply) {
    return reply.map(generic_transformers_1.transformCommandReply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/CONFIG_GET.js
var require_CONFIG_GET = __commonJS((exports) => {
  function transformArguments(parameter) {
    return ["CONFIG", "GET", parameter];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformTuplesReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/CONFIG_RESETSTAT.js
var require_CONFIG_RESETSTAT = __commonJS((exports) => {
  function transformArguments() {
    return ["CONFIG", "RESETSTAT"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CONFIG_REWRITE.js
var require_CONFIG_REWRITE = __commonJS((exports) => {
  function transformArguments() {
    return ["CONFIG", "REWRITE"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/CONFIG_SET.js
var require_CONFIG_SET = __commonJS((exports) => {
  function transformArguments(...[parameterOrConfig, value]) {
    const args = ["CONFIG", "SET"];
    if (typeof parameterOrConfig === "string") {
      args.push(parameterOrConfig, value);
    } else {
      for (const [key, value2] of Object.entries(parameterOrConfig)) {
        args.push(key, value2);
      }
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/DBSIZE.js
var require_DBSIZE = __commonJS((exports) => {
  function transformArguments() {
    return ["DBSIZE"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/DISCARD.js
var require_DISCARD = __commonJS((exports) => {
  function transformArguments() {
    return ["DISCARD"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ECHO.js
var require_ECHO = __commonJS((exports) => {
  function transformArguments(message) {
    return ["ECHO", message];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FAILOVER.js
var require_FAILOVER = __commonJS((exports) => {
  function transformArguments(options) {
    const args = ["FAILOVER"];
    if (options?.TO) {
      args.push("TO", options.TO.host, options.TO.port.toString());
      if (options.TO.FORCE) {
        args.push("FORCE");
      }
    }
    if (options?.ABORT) {
      args.push("ABORT");
    }
    if (options?.TIMEOUT) {
      args.push("TIMEOUT", options.TIMEOUT.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FLUSHALL.js
var require_FLUSHALL = __commonJS((exports) => {
  function transformArguments(mode) {
    const args = ["FLUSHALL"];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.RedisFlushModes = undefined;
  var RedisFlushModes;
  (function(RedisFlushModes2) {
    RedisFlushModes2["ASYNC"] = "ASYNC";
    RedisFlushModes2["SYNC"] = "SYNC";
  })(RedisFlushModes || (exports.RedisFlushModes = RedisFlushModes = {}));
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FLUSHDB.js
var require_FLUSHDB = __commonJS((exports) => {
  function transformArguments(mode) {
    const args = ["FLUSHDB"];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_DELETE.js
var require_FUNCTION_DELETE = __commonJS((exports) => {
  function transformArguments(library) {
    return ["FUNCTION", "DELETE", library];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_DUMP.js
var require_FUNCTION_DUMP = __commonJS((exports) => {
  function transformArguments() {
    return ["FUNCTION", "DUMP"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_FLUSH.js
var require_FUNCTION_FLUSH = __commonJS((exports) => {
  function transformArguments(mode) {
    const args = ["FUNCTION", "FLUSH"];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_KILL.js
var require_FUNCTION_KILL = __commonJS((exports) => {
  function transformArguments() {
    return ["FUNCTION", "KILL"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_LIST.js
var require_FUNCTION_LIST = __commonJS((exports) => {
  function transformArguments(pattern) {
    const args = ["FUNCTION", "LIST"];
    if (pattern) {
      args.push(pattern);
    }
    return args;
  }
  function transformReply(reply) {
    return reply.map(generic_transformers_1.transformFunctionListItemReply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_LIST_WITHCODE.js
var require_FUNCTION_LIST_WITHCODE = __commonJS((exports) => {
  function transformArguments(pattern) {
    const args = (0, FUNCTION_LIST_1.transformArguments)(pattern);
    args.push("WITHCODE");
    return args;
  }
  function transformReply(reply) {
    return reply.map((library) => ({
      ...(0, generic_transformers_1.transformFunctionListItemReply)(library),
      libraryCode: library[7]
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  var FUNCTION_LIST_1 = require_FUNCTION_LIST();
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_LOAD.js
var require_FUNCTION_LOAD = __commonJS((exports) => {
  function transformArguments(code, options) {
    const args = ["FUNCTION", "LOAD"];
    if (options?.REPLACE) {
      args.push("REPLACE");
    }
    args.push(code);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_RESTORE.js
var require_FUNCTION_RESTORE = __commonJS((exports) => {
  function transformArguments(dump, mode) {
    const args = ["FUNCTION", "RESTORE", dump];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/FUNCTION_STATS.js
var require_FUNCTION_STATS = __commonJS((exports) => {
  function transformArguments() {
    return ["FUNCTION", "STATS"];
  }
  function transformReply(reply) {
    const engines = Object.create(null);
    for (let i = 0;i < reply[3].length; i++) {
      engines[reply[3][i]] = {
        librariesCount: reply[3][++i][1],
        functionsCount: reply[3][i][3]
      };
    }
    return {
      runningScript: reply[1] === null ? null : {
        name: reply[1][1],
        command: reply[1][3],
        durationMs: reply[1][5]
      },
      engines
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/HELLO.js
var require_HELLO = __commonJS((exports) => {
  function transformArguments(options) {
    const args = ["HELLO"];
    if (options) {
      args.push(options.protover.toString());
      if (options.auth) {
        args.push("AUTH", options.auth.username, options.auth.password);
      }
      if (options.clientName) {
        args.push("SETNAME", options.clientName);
      }
    }
    return args;
  }
  function transformReply(reply) {
    return {
      server: reply[1],
      version: reply[3],
      proto: reply[5],
      id: reply[7],
      mode: reply[9],
      role: reply[11],
      modules: reply[13]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/INFO.js
var require_INFO = __commonJS((exports) => {
  function transformArguments(section) {
    const args = ["INFO"];
    if (section) {
      args.push(section);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/KEYS.js
var require_KEYS = __commonJS((exports) => {
  function transformArguments(pattern) {
    return ["KEYS", pattern];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LASTSAVE.js
var require_LASTSAVE = __commonJS((exports) => {
  function transformArguments() {
    return ["LASTSAVE"];
  }
  function transformReply(reply) {
    return new Date(reply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/LATENCY_DOCTOR.js
var require_LATENCY_DOCTOR = __commonJS((exports) => {
  function transformArguments() {
    return ["LATENCY", "DOCTOR"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LATENCY_GRAPH.js
var require_LATENCY_GRAPH = __commonJS((exports) => {
  function transformArguments(event) {
    return ["LATENCY", "GRAPH", event];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LATENCY_HISTORY.js
var require_LATENCY_HISTORY = __commonJS((exports) => {
  function transformArguments(event) {
    return ["LATENCY", "HISTORY", event];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LATENCY_LATEST.js
var require_LATENCY_LATEST = __commonJS((exports) => {
  function transformArguments() {
    return ["LATENCY", "LATEST"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/LOLWUT.js
var require_LOLWUT = __commonJS((exports) => {
  function transformArguments(version, ...optionalArguments) {
    const args = ["LOLWUT"];
    if (version) {
      args.push("VERSION", version.toString(), ...optionalArguments.map(String));
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MEMORY_DOCTOR.js
var require_MEMORY_DOCTOR = __commonJS((exports) => {
  function transformArguments() {
    return ["MEMORY", "DOCTOR"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MEMORY_MALLOC-STATS.js
var require_MEMORY_MALLOC_STATS = __commonJS((exports) => {
  function transformArguments() {
    return ["MEMORY", "MALLOC-STATS"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MEMORY_PURGE.js
var require_MEMORY_PURGE = __commonJS((exports) => {
  function transformArguments() {
    return ["MEMORY", "PURGE"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MEMORY_STATS.js
var require_MEMORY_STATS = __commonJS((exports) => {
  function transformArguments() {
    return ["MEMORY", "STATS"];
  }
  function transformReply(rawReply) {
    const reply = {
      db: {}
    };
    for (let i = 0;i < rawReply.length; i += 2) {
      const key = rawReply[i];
      if (key.startsWith("db.")) {
        const dbTuples = rawReply[i + 1], db = {};
        for (let j = 0;j < dbTuples.length; j += 2) {
          db[DB_FIELDS_MAPPING[dbTuples[j]]] = dbTuples[j + 1];
        }
        reply.db[key.substring(3)] = db;
        continue;
      }
      reply[FIELDS_MAPPING[key]] = Number(rawReply[i + 1]);
    }
    return reply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  var FIELDS_MAPPING = {
    "peak.allocated": "peakAllocated",
    "total.allocated": "totalAllocated",
    "startup.allocated": "startupAllocated",
    "replication.backlog": "replicationBacklog",
    "clients.slaves": "clientsReplicas",
    "clients.normal": "clientsNormal",
    "aof.buffer": "aofBuffer",
    "lua.caches": "luaCaches",
    "overhead.total": "overheadTotal",
    "keys.count": "keysCount",
    "keys.bytes-per-key": "keysBytesPerKey",
    "dataset.bytes": "datasetBytes",
    "dataset.percentage": "datasetPercentage",
    "peak.percentage": "peakPercentage",
    "allocator.allocated": "allocatorAllocated",
    "allocator.active": "allocatorActive",
    "allocator.resident": "allocatorResident",
    "allocator-fragmentation.ratio": "allocatorFragmentationRatio",
    "allocator-fragmentation.bytes": "allocatorFragmentationBytes",
    "allocator-rss.ratio": "allocatorRssRatio",
    "allocator-rss.bytes": "allocatorRssBytes",
    "rss-overhead.ratio": "rssOverheadRatio",
    "rss-overhead.bytes": "rssOverheadBytes",
    fragmentation: "fragmentation",
    "fragmentation.bytes": "fragmentationBytes"
  };
  var DB_FIELDS_MAPPING = {
    "overhead.hashtable.main": "overheadHashtableMain",
    "overhead.hashtable.expires": "overheadHashtableExpires"
  };
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/MEMORY_USAGE.js
var require_MEMORY_USAGE = __commonJS((exports) => {
  function transformArguments(key, options) {
    const args = ["MEMORY", "USAGE", key];
    if (options?.SAMPLES) {
      args.push("SAMPLES", options.SAMPLES.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MODULE_LIST.js
var require_MODULE_LIST = __commonJS((exports) => {
  function transformArguments() {
    return ["MODULE", "LIST"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MODULE_LOAD.js
var require_MODULE_LOAD = __commonJS((exports) => {
  function transformArguments(path, moduleArgs) {
    const args = ["MODULE", "LOAD", path];
    if (moduleArgs) {
      args.push(...moduleArgs);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MODULE_UNLOAD.js
var require_MODULE_UNLOAD = __commonJS((exports) => {
  function transformArguments(name) {
    return ["MODULE", "UNLOAD", name];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/MOVE.js
var require_MOVE = __commonJS((exports) => {
  function transformArguments(key, db) {
    return ["MOVE", key, db.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/PING.js
var require_PING = __commonJS((exports) => {
  function transformArguments(message) {
    const args = ["PING"];
    if (message) {
      args.push(message);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PUBSUB_CHANNELS.js
var require_PUBSUB_CHANNELS = __commonJS((exports) => {
  function transformArguments(pattern) {
    const args = ["PUBSUB", "CHANNELS"];
    if (pattern) {
      args.push(pattern);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PUBSUB_NUMPAT.js
var require_PUBSUB_NUMPAT = __commonJS((exports) => {
  function transformArguments() {
    return ["PUBSUB", "NUMPAT"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PUBSUB_NUMSUB.js
var require_PUBSUB_NUMSUB = __commonJS((exports) => {
  function transformArguments(channels) {
    const args = ["PUBSUB", "NUMSUB"];
    if (channels)
      return (0, generic_transformers_1.pushVerdictArguments)(args, channels);
    return args;
  }
  function transformReply(rawReply) {
    const transformedReply = Object.create(null);
    for (let i = 0;i < rawReply.length; i += 2) {
      transformedReply[rawReply[i]] = rawReply[i + 1];
    }
    return transformedReply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/PUBSUB_SHARDCHANNELS.js
var require_PUBSUB_SHARDCHANNELS = __commonJS((exports) => {
  function transformArguments(pattern) {
    const args = ["PUBSUB", "SHARDCHANNELS"];
    if (pattern)
      args.push(pattern);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/PUBSUB_SHARDNUMSUB.js
var require_PUBSUB_SHARDNUMSUB = __commonJS((exports) => {
  function transformArguments(channels) {
    const args = ["PUBSUB", "SHARDNUMSUB"];
    if (channels)
      return (0, generic_transformers_1.pushVerdictArguments)(args, channels);
    return args;
  }
  function transformReply(rawReply) {
    const transformedReply = Object.create(null);
    for (let i = 0;i < rawReply.length; i += 2) {
      transformedReply[rawReply[i]] = rawReply[i + 1];
    }
    return transformedReply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/RANDOMKEY.js
var require_RANDOMKEY = __commonJS((exports) => {
  function transformArguments() {
    return ["RANDOMKEY"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/READONLY.js
var require_READONLY = __commonJS((exports) => {
  function transformArguments() {
    return ["READONLY"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/READWRITE.js
var require_READWRITE = __commonJS((exports) => {
  function transformArguments() {
    return ["READWRITE"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/REPLICAOF.js
var require_REPLICAOF = __commonJS((exports) => {
  function transformArguments(host, port) {
    return ["REPLICAOF", host, port.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/RESTORE-ASKING.js
var require_RESTORE_ASKING = __commonJS((exports) => {
  function transformArguments() {
    return ["RESTORE-ASKING"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/ROLE.js
var require_ROLE = __commonJS((exports) => {
  function transformArguments() {
    return ["ROLE"];
  }
  function transformReply(reply) {
    switch (reply[0]) {
      case "master":
        return {
          role: "master",
          replicationOffest: reply[1],
          replicas: reply[2].map(([ip, port, replicationOffest]) => ({
            ip,
            port: Number(port),
            replicationOffest: Number(replicationOffest)
          }))
        };
      case "slave":
        return {
          role: "slave",
          master: {
            ip: reply[1],
            port: reply[2]
          },
          state: reply[3],
          dataReceived: reply[4]
        };
      case "sentinel":
        return {
          role: "sentinel",
          masterNames: reply[1]
        };
    }
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/SAVE.js
var require_SAVE = __commonJS((exports) => {
  function transformArguments() {
    return ["SAVE"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SCAN.js
var require_SCAN = __commonJS((exports) => {
  function transformArguments(cursor, options) {
    const args = (0, generic_transformers_1.pushScanArguments)(["SCAN"], cursor, options);
    if (options?.TYPE) {
      args.push("TYPE", options.TYPE);
    }
    return args;
  }
  function transformReply([cursor, keys]) {
    return {
      cursor: Number(cursor),
      keys
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/SCRIPT_DEBUG.js
var require_SCRIPT_DEBUG = __commonJS((exports) => {
  function transformArguments(mode) {
    return ["SCRIPT", "DEBUG", mode];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SCRIPT_EXISTS.js
var require_SCRIPT_EXISTS = __commonJS((exports) => {
  function transformArguments(sha1) {
    return (0, generic_transformers_1.pushVerdictArguments)(["SCRIPT", "EXISTS"], sha1);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformBooleanArrayReply;
  } });
});

// node_modules/@redis/client/dist/lib/commands/SCRIPT_FLUSH.js
var require_SCRIPT_FLUSH = __commonJS((exports) => {
  function transformArguments(mode) {
    const args = ["SCRIPT", "FLUSH"];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SCRIPT_KILL.js
var require_SCRIPT_KILL = __commonJS((exports) => {
  function transformArguments() {
    return ["SCRIPT", "KILL"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SCRIPT_LOAD.js
var require_SCRIPT_LOAD = __commonJS((exports) => {
  function transformArguments(script) {
    return ["SCRIPT", "LOAD", script];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SHUTDOWN.js
var require_SHUTDOWN = __commonJS((exports) => {
  function transformArguments(mode) {
    const args = ["SHUTDOWN"];
    if (mode) {
      args.push(mode);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/SWAPDB.js
var require_SWAPDB = __commonJS((exports) => {
  function transformArguments(index1, index2) {
    return ["SWAPDB", index1.toString(), index2.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/TIME.js
var require_TIME = __commonJS((exports) => {
  function transformArguments() {
    return ["TIME"];
  }
  function transformReply(reply) {
    const seconds = Number(reply[0]), microseconds = Number(reply[1]), d = new Date(seconds * 1000 + microseconds / 1000);
    d.microseconds = microseconds;
    return d;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/client/dist/lib/commands/UNWATCH.js
var require_UNWATCH = __commonJS((exports) => {
  function transformArguments() {
    return ["UNWATCH"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/commands/WAIT.js
var require_WAIT = __commonJS((exports) => {
  function transformArguments(numberOfReplicas, timeout) {
    return ["WAIT", numberOfReplicas.toString(), timeout.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/client/dist/lib/client/commands.js
var require_commands2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var commands_1 = require_commands();
  var ACL_CAT = require_ACL_CAT();
  var ACL_DELUSER = require_ACL_DELUSER();
  var ACL_DRYRUN = require_ACL_DRYRUN();
  var ACL_GENPASS = require_ACL_GENPASS();
  var ACL_GETUSER = require_ACL_GETUSER();
  var ACL_LIST = require_ACL_LIST();
  var ACL_LOAD = require_ACL_LOAD();
  var ACL_LOG_RESET = require_ACL_LOG_RESET();
  var ACL_LOG = require_ACL_LOG();
  var ACL_SAVE = require_ACL_SAVE();
  var ACL_SETUSER = require_ACL_SETUSER();
  var ACL_USERS = require_ACL_USERS();
  var ACL_WHOAMI = require_ACL_WHOAMI();
  var ASKING = require_ASKING();
  var AUTH = require_AUTH();
  var BGREWRITEAOF = require_BGREWRITEAOF();
  var BGSAVE = require_BGSAVE();
  var CLIENT_CACHING = require_CLIENT_CACHING();
  var CLIENT_GETNAME = require_CLIENT_GETNAME();
  var CLIENT_GETREDIR = require_CLIENT_GETREDIR();
  var CLIENT_ID = require_CLIENT_ID();
  var CLIENT_KILL = require_CLIENT_KILL();
  var CLIENT_LIST = require_CLIENT_LIST();
  var CLIENT_NO_EVICT = require_CLIENT_NO_EVICT();
  var CLIENT_NO_TOUCH = require_CLIENT_NO_TOUCH();
  var CLIENT_PAUSE = require_CLIENT_PAUSE();
  var CLIENT_SETNAME = require_CLIENT_SETNAME();
  var CLIENT_TRACKING = require_CLIENT_TRACKING();
  var CLIENT_TRACKINGINFO = require_CLIENT_TRACKINGINFO();
  var CLIENT_UNPAUSE = require_CLIENT_UNPAUSE();
  var CLIENT_INFO = require_CLIENT_INFO();
  var CLUSTER_ADDSLOTS = require_CLUSTER_ADDSLOTS();
  var CLUSTER_ADDSLOTSRANGE = require_CLUSTER_ADDSLOTSRANGE();
  var CLUSTER_BUMPEPOCH = require_CLUSTER_BUMPEPOCH();
  var CLUSTER_COUNT_FAILURE_REPORTS = require_CLUSTER_COUNT_FAILURE_REPORTS();
  var CLUSTER_COUNTKEYSINSLOT = require_CLUSTER_COUNTKEYSINSLOT();
  var CLUSTER_DELSLOTS = require_CLUSTER_DELSLOTS();
  var CLUSTER_DELSLOTSRANGE = require_CLUSTER_DELSLOTSRANGE();
  var CLUSTER_FAILOVER = require_CLUSTER_FAILOVER();
  var CLUSTER_FLUSHSLOTS = require_CLUSTER_FLUSHSLOTS();
  var CLUSTER_FORGET = require_CLUSTER_FORGET();
  var CLUSTER_GETKEYSINSLOT = require_CLUSTER_GETKEYSINSLOT();
  var CLUSTER_INFO = require_CLUSTER_INFO();
  var CLUSTER_KEYSLOT = require_CLUSTER_KEYSLOT();
  var CLUSTER_LINKS = require_CLUSTER_LINKS();
  var CLUSTER_MEET = require_CLUSTER_MEET();
  var CLUSTER_MYID = require_CLUSTER_MYID();
  var CLUSTER_MYSHARDID = require_CLUSTER_MYSHARDID();
  var CLUSTER_NODES = require_CLUSTER_NODES();
  var CLUSTER_REPLICAS = require_CLUSTER_REPLICAS();
  var CLUSTER_REPLICATE = require_CLUSTER_REPLICATE();
  var CLUSTER_RESET = require_CLUSTER_RESET();
  var CLUSTER_SAVECONFIG = require_CLUSTER_SAVECONFIG();
  var CLUSTER_SET_CONFIG_EPOCH = require_CLUSTER_SET_CONFIG_EPOCH();
  var CLUSTER_SETSLOT = require_CLUSTER_SETSLOT();
  var CLUSTER_SLOTS = require_CLUSTER_SLOTS();
  var COMMAND_COUNT = require_COMMAND_COUNT();
  var COMMAND_GETKEYS = require_COMMAND_GETKEYS();
  var COMMAND_GETKEYSANDFLAGS = require_COMMAND_GETKEYSANDFLAGS();
  var COMMAND_INFO = require_COMMAND_INFO();
  var COMMAND_LIST = require_COMMAND_LIST();
  var COMMAND = require_COMMAND();
  var CONFIG_GET = require_CONFIG_GET();
  var CONFIG_RESETASTAT = require_CONFIG_RESETSTAT();
  var CONFIG_REWRITE = require_CONFIG_REWRITE();
  var CONFIG_SET = require_CONFIG_SET();
  var DBSIZE = require_DBSIZE();
  var DISCARD = require_DISCARD();
  var ECHO = require_ECHO();
  var FAILOVER = require_FAILOVER();
  var FLUSHALL = require_FLUSHALL();
  var FLUSHDB = require_FLUSHDB();
  var FUNCTION_DELETE = require_FUNCTION_DELETE();
  var FUNCTION_DUMP = require_FUNCTION_DUMP();
  var FUNCTION_FLUSH = require_FUNCTION_FLUSH();
  var FUNCTION_KILL = require_FUNCTION_KILL();
  var FUNCTION_LIST_WITHCODE = require_FUNCTION_LIST_WITHCODE();
  var FUNCTION_LIST = require_FUNCTION_LIST();
  var FUNCTION_LOAD = require_FUNCTION_LOAD();
  var FUNCTION_RESTORE = require_FUNCTION_RESTORE();
  var FUNCTION_STATS = require_FUNCTION_STATS();
  var HELLO = require_HELLO();
  var INFO = require_INFO();
  var KEYS = require_KEYS();
  var LASTSAVE = require_LASTSAVE();
  var LATENCY_DOCTOR = require_LATENCY_DOCTOR();
  var LATENCY_GRAPH = require_LATENCY_GRAPH();
  var LATENCY_HISTORY = require_LATENCY_HISTORY();
  var LATENCY_LATEST = require_LATENCY_LATEST();
  var LOLWUT = require_LOLWUT();
  var MEMORY_DOCTOR = require_MEMORY_DOCTOR();
  var MEMORY_MALLOC_STATS = require_MEMORY_MALLOC_STATS();
  var MEMORY_PURGE = require_MEMORY_PURGE();
  var MEMORY_STATS = require_MEMORY_STATS();
  var MEMORY_USAGE = require_MEMORY_USAGE();
  var MODULE_LIST = require_MODULE_LIST();
  var MODULE_LOAD = require_MODULE_LOAD();
  var MODULE_UNLOAD = require_MODULE_UNLOAD();
  var MOVE = require_MOVE();
  var PING = require_PING();
  var PUBSUB_CHANNELS = require_PUBSUB_CHANNELS();
  var PUBSUB_NUMPAT = require_PUBSUB_NUMPAT();
  var PUBSUB_NUMSUB = require_PUBSUB_NUMSUB();
  var PUBSUB_SHARDCHANNELS = require_PUBSUB_SHARDCHANNELS();
  var PUBSUB_SHARDNUMSUB = require_PUBSUB_SHARDNUMSUB();
  var RANDOMKEY = require_RANDOMKEY();
  var READONLY = require_READONLY();
  var READWRITE = require_READWRITE();
  var REPLICAOF = require_REPLICAOF();
  var RESTORE_ASKING = require_RESTORE_ASKING();
  var ROLE = require_ROLE();
  var SAVE = require_SAVE();
  var SCAN = require_SCAN();
  var SCRIPT_DEBUG = require_SCRIPT_DEBUG();
  var SCRIPT_EXISTS = require_SCRIPT_EXISTS();
  var SCRIPT_FLUSH = require_SCRIPT_FLUSH();
  var SCRIPT_KILL = require_SCRIPT_KILL();
  var SCRIPT_LOAD = require_SCRIPT_LOAD();
  var SHUTDOWN = require_SHUTDOWN();
  var SWAPDB = require_SWAPDB();
  var TIME = require_TIME();
  var UNWATCH = require_UNWATCH();
  var WAIT = require_WAIT();
  exports.default = {
    ...commands_1.default,
    ACL_CAT,
    aclCat: ACL_CAT,
    ACL_DELUSER,
    aclDelUser: ACL_DELUSER,
    ACL_DRYRUN,
    aclDryRun: ACL_DRYRUN,
    ACL_GENPASS,
    aclGenPass: ACL_GENPASS,
    ACL_GETUSER,
    aclGetUser: ACL_GETUSER,
    ACL_LIST,
    aclList: ACL_LIST,
    ACL_LOAD,
    aclLoad: ACL_LOAD,
    ACL_LOG_RESET,
    aclLogReset: ACL_LOG_RESET,
    ACL_LOG,
    aclLog: ACL_LOG,
    ACL_SAVE,
    aclSave: ACL_SAVE,
    ACL_SETUSER,
    aclSetUser: ACL_SETUSER,
    ACL_USERS,
    aclUsers: ACL_USERS,
    ACL_WHOAMI,
    aclWhoAmI: ACL_WHOAMI,
    ASKING,
    asking: ASKING,
    AUTH,
    auth: AUTH,
    BGREWRITEAOF,
    bgRewriteAof: BGREWRITEAOF,
    BGSAVE,
    bgSave: BGSAVE,
    CLIENT_CACHING,
    clientCaching: CLIENT_CACHING,
    CLIENT_GETNAME,
    clientGetName: CLIENT_GETNAME,
    CLIENT_GETREDIR,
    clientGetRedir: CLIENT_GETREDIR,
    CLIENT_ID,
    clientId: CLIENT_ID,
    CLIENT_KILL,
    clientKill: CLIENT_KILL,
    "CLIENT_NO-EVICT": CLIENT_NO_EVICT,
    clientNoEvict: CLIENT_NO_EVICT,
    "CLIENT_NO-TOUCH": CLIENT_NO_TOUCH,
    clientNoTouch: CLIENT_NO_TOUCH,
    CLIENT_LIST,
    clientList: CLIENT_LIST,
    CLIENT_PAUSE,
    clientPause: CLIENT_PAUSE,
    CLIENT_SETNAME,
    clientSetName: CLIENT_SETNAME,
    CLIENT_TRACKING,
    clientTracking: CLIENT_TRACKING,
    CLIENT_TRACKINGINFO,
    clientTrackingInfo: CLIENT_TRACKINGINFO,
    CLIENT_UNPAUSE,
    clientUnpause: CLIENT_UNPAUSE,
    CLIENT_INFO,
    clientInfo: CLIENT_INFO,
    CLUSTER_ADDSLOTS,
    clusterAddSlots: CLUSTER_ADDSLOTS,
    CLUSTER_ADDSLOTSRANGE,
    clusterAddSlotsRange: CLUSTER_ADDSLOTSRANGE,
    CLUSTER_BUMPEPOCH,
    clusterBumpEpoch: CLUSTER_BUMPEPOCH,
    CLUSTER_COUNT_FAILURE_REPORTS,
    clusterCountFailureReports: CLUSTER_COUNT_FAILURE_REPORTS,
    CLUSTER_COUNTKEYSINSLOT,
    clusterCountKeysInSlot: CLUSTER_COUNTKEYSINSLOT,
    CLUSTER_DELSLOTS,
    clusterDelSlots: CLUSTER_DELSLOTS,
    CLUSTER_DELSLOTSRANGE,
    clusterDelSlotsRange: CLUSTER_DELSLOTSRANGE,
    CLUSTER_FAILOVER,
    clusterFailover: CLUSTER_FAILOVER,
    CLUSTER_FLUSHSLOTS,
    clusterFlushSlots: CLUSTER_FLUSHSLOTS,
    CLUSTER_FORGET,
    clusterForget: CLUSTER_FORGET,
    CLUSTER_GETKEYSINSLOT,
    clusterGetKeysInSlot: CLUSTER_GETKEYSINSLOT,
    CLUSTER_INFO,
    clusterInfo: CLUSTER_INFO,
    CLUSTER_KEYSLOT,
    clusterKeySlot: CLUSTER_KEYSLOT,
    CLUSTER_LINKS,
    clusterLinks: CLUSTER_LINKS,
    CLUSTER_MEET,
    clusterMeet: CLUSTER_MEET,
    CLUSTER_MYID,
    clusterMyId: CLUSTER_MYID,
    CLUSTER_MYSHARDID,
    clusterMyShardId: CLUSTER_MYSHARDID,
    CLUSTER_NODES,
    clusterNodes: CLUSTER_NODES,
    CLUSTER_REPLICAS,
    clusterReplicas: CLUSTER_REPLICAS,
    CLUSTER_REPLICATE,
    clusterReplicate: CLUSTER_REPLICATE,
    CLUSTER_RESET,
    clusterReset: CLUSTER_RESET,
    CLUSTER_SAVECONFIG,
    clusterSaveConfig: CLUSTER_SAVECONFIG,
    CLUSTER_SET_CONFIG_EPOCH,
    clusterSetConfigEpoch: CLUSTER_SET_CONFIG_EPOCH,
    CLUSTER_SETSLOT,
    clusterSetSlot: CLUSTER_SETSLOT,
    CLUSTER_SLOTS,
    clusterSlots: CLUSTER_SLOTS,
    COMMAND_COUNT,
    commandCount: COMMAND_COUNT,
    COMMAND_GETKEYS,
    commandGetKeys: COMMAND_GETKEYS,
    COMMAND_GETKEYSANDFLAGS,
    commandGetKeysAndFlags: COMMAND_GETKEYSANDFLAGS,
    COMMAND_INFO,
    commandInfo: COMMAND_INFO,
    COMMAND_LIST,
    commandList: COMMAND_LIST,
    COMMAND,
    command: COMMAND,
    CONFIG_GET,
    configGet: CONFIG_GET,
    CONFIG_RESETASTAT,
    configResetStat: CONFIG_RESETASTAT,
    CONFIG_REWRITE,
    configRewrite: CONFIG_REWRITE,
    CONFIG_SET,
    configSet: CONFIG_SET,
    DBSIZE,
    dbSize: DBSIZE,
    DISCARD,
    discard: DISCARD,
    ECHO,
    echo: ECHO,
    FAILOVER,
    failover: FAILOVER,
    FLUSHALL,
    flushAll: FLUSHALL,
    FLUSHDB,
    flushDb: FLUSHDB,
    FUNCTION_DELETE,
    functionDelete: FUNCTION_DELETE,
    FUNCTION_DUMP,
    functionDump: FUNCTION_DUMP,
    FUNCTION_FLUSH,
    functionFlush: FUNCTION_FLUSH,
    FUNCTION_KILL,
    functionKill: FUNCTION_KILL,
    FUNCTION_LIST_WITHCODE,
    functionListWithCode: FUNCTION_LIST_WITHCODE,
    FUNCTION_LIST,
    functionList: FUNCTION_LIST,
    FUNCTION_LOAD,
    functionLoad: FUNCTION_LOAD,
    FUNCTION_RESTORE,
    functionRestore: FUNCTION_RESTORE,
    FUNCTION_STATS,
    functionStats: FUNCTION_STATS,
    HELLO,
    hello: HELLO,
    INFO,
    info: INFO,
    KEYS,
    keys: KEYS,
    LASTSAVE,
    lastSave: LASTSAVE,
    LATENCY_DOCTOR,
    latencyDoctor: LATENCY_DOCTOR,
    LATENCY_GRAPH,
    latencyGraph: LATENCY_GRAPH,
    LATENCY_HISTORY,
    latencyHistory: LATENCY_HISTORY,
    LATENCY_LATEST,
    latencyLatest: LATENCY_LATEST,
    LOLWUT,
    lolwut: LOLWUT,
    MEMORY_DOCTOR,
    memoryDoctor: MEMORY_DOCTOR,
    "MEMORY_MALLOC-STATS": MEMORY_MALLOC_STATS,
    memoryMallocStats: MEMORY_MALLOC_STATS,
    MEMORY_PURGE,
    memoryPurge: MEMORY_PURGE,
    MEMORY_STATS,
    memoryStats: MEMORY_STATS,
    MEMORY_USAGE,
    memoryUsage: MEMORY_USAGE,
    MODULE_LIST,
    moduleList: MODULE_LIST,
    MODULE_LOAD,
    moduleLoad: MODULE_LOAD,
    MODULE_UNLOAD,
    moduleUnload: MODULE_UNLOAD,
    MOVE,
    move: MOVE,
    PING,
    ping: PING,
    PUBSUB_CHANNELS,
    pubSubChannels: PUBSUB_CHANNELS,
    PUBSUB_NUMPAT,
    pubSubNumPat: PUBSUB_NUMPAT,
    PUBSUB_NUMSUB,
    pubSubNumSub: PUBSUB_NUMSUB,
    PUBSUB_SHARDCHANNELS,
    pubSubShardChannels: PUBSUB_SHARDCHANNELS,
    PUBSUB_SHARDNUMSUB,
    pubSubShardNumSub: PUBSUB_SHARDNUMSUB,
    RANDOMKEY,
    randomKey: RANDOMKEY,
    READONLY,
    readonly: READONLY,
    READWRITE,
    readwrite: READWRITE,
    REPLICAOF,
    replicaOf: REPLICAOF,
    "RESTORE-ASKING": RESTORE_ASKING,
    restoreAsking: RESTORE_ASKING,
    ROLE,
    role: ROLE,
    SAVE,
    save: SAVE,
    SCAN,
    scan: SCAN,
    SCRIPT_DEBUG,
    scriptDebug: SCRIPT_DEBUG,
    SCRIPT_EXISTS,
    scriptExists: SCRIPT_EXISTS,
    SCRIPT_FLUSH,
    scriptFlush: SCRIPT_FLUSH,
    SCRIPT_KILL,
    scriptKill: SCRIPT_KILL,
    SCRIPT_LOAD,
    scriptLoad: SCRIPT_LOAD,
    SHUTDOWN,
    shutdown: SHUTDOWN,
    SWAPDB,
    swapDb: SWAPDB,
    TIME,
    time: TIME,
    UNWATCH,
    unwatch: UNWATCH,
    WAIT,
    wait: WAIT
  };
});

// node_modules/@redis/client/dist/lib/errors.js
var require_errors = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.MultiErrorReply = exports.ErrorReply = exports.ReconnectStrategyError = exports.RootNodesUnavailableError = exports.SocketClosedUnexpectedlyError = exports.DisconnectsClientError = exports.ClientOfflineError = exports.ClientClosedError = exports.ConnectionTimeoutError = exports.WatchError = exports.AbortError = undefined;

  class AbortError extends Error {
    constructor() {
      super("The command was aborted");
    }
  }
  exports.AbortError = AbortError;

  class WatchError extends Error {
    constructor() {
      super("One (or more) of the watched keys has been changed");
    }
  }
  exports.WatchError = WatchError;

  class ConnectionTimeoutError extends Error {
    constructor() {
      super("Connection timeout");
    }
  }
  exports.ConnectionTimeoutError = ConnectionTimeoutError;

  class ClientClosedError extends Error {
    constructor() {
      super("The client is closed");
    }
  }
  exports.ClientClosedError = ClientClosedError;

  class ClientOfflineError extends Error {
    constructor() {
      super("The client is offline");
    }
  }
  exports.ClientOfflineError = ClientOfflineError;

  class DisconnectsClientError extends Error {
    constructor() {
      super("Disconnects client");
    }
  }
  exports.DisconnectsClientError = DisconnectsClientError;

  class SocketClosedUnexpectedlyError extends Error {
    constructor() {
      super("Socket closed unexpectedly");
    }
  }
  exports.SocketClosedUnexpectedlyError = SocketClosedUnexpectedlyError;

  class RootNodesUnavailableError extends Error {
    constructor() {
      super("All the root nodes are unavailable");
    }
  }
  exports.RootNodesUnavailableError = RootNodesUnavailableError;

  class ReconnectStrategyError extends Error {
    constructor(originalError, socketError) {
      super(originalError.message);
      Object.defineProperty(this, "originalError", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "socketError", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.originalError = originalError;
      this.socketError = socketError;
    }
  }
  exports.ReconnectStrategyError = ReconnectStrategyError;

  class ErrorReply extends Error {
    constructor(message) {
      super(message);
      this.stack = undefined;
    }
  }
  exports.ErrorReply = ErrorReply;

  class MultiErrorReply extends ErrorReply {
    constructor(replies, errorIndexes) {
      super(`${errorIndexes.length} commands failed, see .replies and .errorIndexes for more information`);
      Object.defineProperty(this, "replies", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "errorIndexes", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      this.replies = replies;
      this.errorIndexes = errorIndexes;
    }
    *errors() {
      for (const index of this.errorIndexes) {
        yield this.replies[index];
      }
    }
  }
  exports.MultiErrorReply = MultiErrorReply;
});

// node_modules/@redis/client/dist/lib/utils.js
var require_utils = __commonJS((exports) => {
  function promiseTimeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.promiseTimeout = undefined;
  exports.promiseTimeout = promiseTimeout;
});

// node_modules/@redis/client/dist/lib/client/socket.js
var require_socket = __commonJS((exports) => {
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _RedisSocket_instances;
  var _a;
  var _RedisSocket_initiateOptions;
  var _RedisSocket_isTlsSocket;
  var _RedisSocket_initiator;
  var _RedisSocket_options;
  var _RedisSocket_socket;
  var _RedisSocket_isOpen;
  var _RedisSocket_isReady;
  var _RedisSocket_writableNeedDrain;
  var _RedisSocket_isSocketUnrefed;
  var _RedisSocket_reconnectStrategy;
  var _RedisSocket_shouldReconnect;
  var _RedisSocket_connect;
  var _RedisSocket_createSocket;
  var _RedisSocket_createNetSocket;
  var _RedisSocket_createTlsSocket;
  var _RedisSocket_onSocketError;
  var _RedisSocket_disconnect;
  var _RedisSocket_isCorked;
  Object.defineProperty(exports, "__esModule", { value: true });
  var events_1 = import.meta.require("events");
  var net = import.meta.require("net");
  var tls = import.meta.require("tls");
  var errors_1 = require_errors();
  var utils_1 = require_utils();

  class RedisSocket extends events_1.EventEmitter {
    get isOpen() {
      return __classPrivateFieldGet(this, _RedisSocket_isOpen, "f");
    }
    get isReady() {
      return __classPrivateFieldGet(this, _RedisSocket_isReady, "f");
    }
    get writableNeedDrain() {
      return __classPrivateFieldGet(this, _RedisSocket_writableNeedDrain, "f");
    }
    constructor(initiator, options) {
      super();
      _RedisSocket_instances.add(this);
      _RedisSocket_initiator.set(this, undefined);
      _RedisSocket_options.set(this, undefined);
      _RedisSocket_socket.set(this, undefined);
      _RedisSocket_isOpen.set(this, false);
      _RedisSocket_isReady.set(this, false);
      _RedisSocket_writableNeedDrain.set(this, false);
      _RedisSocket_isSocketUnrefed.set(this, false);
      _RedisSocket_isCorked.set(this, false);
      __classPrivateFieldSet(this, _RedisSocket_initiator, initiator, "f");
      __classPrivateFieldSet(this, _RedisSocket_options, __classPrivateFieldGet(_a, _a, "m", _RedisSocket_initiateOptions).call(_a, options), "f");
    }
    async connect() {
      if (__classPrivateFieldGet(this, _RedisSocket_isOpen, "f")) {
        throw new Error("Socket already opened");
      }
      __classPrivateFieldSet(this, _RedisSocket_isOpen, true, "f");
      return __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_connect).call(this);
    }
    writeCommand(args) {
      if (!__classPrivateFieldGet(this, _RedisSocket_socket, "f")) {
        throw new errors_1.ClientClosedError;
      }
      for (const toWrite of args) {
        __classPrivateFieldSet(this, _RedisSocket_writableNeedDrain, !__classPrivateFieldGet(this, _RedisSocket_socket, "f").write(toWrite), "f");
      }
    }
    disconnect() {
      if (!__classPrivateFieldGet(this, _RedisSocket_isOpen, "f")) {
        throw new errors_1.ClientClosedError;
      }
      __classPrivateFieldSet(this, _RedisSocket_isOpen, false, "f");
      __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_disconnect).call(this);
    }
    async quit(fn) {
      if (!__classPrivateFieldGet(this, _RedisSocket_isOpen, "f")) {
        throw new errors_1.ClientClosedError;
      }
      __classPrivateFieldSet(this, _RedisSocket_isOpen, false, "f");
      const reply = await fn();
      __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_disconnect).call(this);
      return reply;
    }
    cork() {
      if (!__classPrivateFieldGet(this, _RedisSocket_socket, "f") || __classPrivateFieldGet(this, _RedisSocket_isCorked, "f")) {
        return;
      }
      __classPrivateFieldGet(this, _RedisSocket_socket, "f").cork();
      __classPrivateFieldSet(this, _RedisSocket_isCorked, true, "f");
      setImmediate(() => {
        __classPrivateFieldGet(this, _RedisSocket_socket, "f")?.uncork();
        __classPrivateFieldSet(this, _RedisSocket_isCorked, false, "f");
      });
    }
    ref() {
      __classPrivateFieldSet(this, _RedisSocket_isSocketUnrefed, false, "f");
      __classPrivateFieldGet(this, _RedisSocket_socket, "f")?.ref();
    }
    unref() {
      __classPrivateFieldSet(this, _RedisSocket_isSocketUnrefed, true, "f");
      __classPrivateFieldGet(this, _RedisSocket_socket, "f")?.unref();
    }
  }
  _a = RedisSocket, _RedisSocket_initiator = new WeakMap, _RedisSocket_options = new WeakMap, _RedisSocket_socket = new WeakMap, _RedisSocket_isOpen = new WeakMap, _RedisSocket_isReady = new WeakMap, _RedisSocket_writableNeedDrain = new WeakMap, _RedisSocket_isSocketUnrefed = new WeakMap, _RedisSocket_isCorked = new WeakMap, _RedisSocket_instances = new WeakSet, _RedisSocket_initiateOptions = function _RedisSocket_initiateOptions(options) {
    var _b, _c;
    options ?? (options = {});
    if (!options.path) {
      (_b = options).port ?? (_b.port = 6379);
      (_c = options).host ?? (_c.host = "localhost");
    }
    options.connectTimeout ?? (options.connectTimeout = 5000);
    options.keepAlive ?? (options.keepAlive = 5000);
    options.noDelay ?? (options.noDelay = true);
    return options;
  }, _RedisSocket_isTlsSocket = function _RedisSocket_isTlsSocket(options) {
    return options.tls === true;
  }, _RedisSocket_reconnectStrategy = function _RedisSocket_reconnectStrategy(retries, cause) {
    if (__classPrivateFieldGet(this, _RedisSocket_options, "f").reconnectStrategy === false) {
      return false;
    } else if (typeof __classPrivateFieldGet(this, _RedisSocket_options, "f").reconnectStrategy === "number") {
      return __classPrivateFieldGet(this, _RedisSocket_options, "f").reconnectStrategy;
    } else if (__classPrivateFieldGet(this, _RedisSocket_options, "f").reconnectStrategy) {
      try {
        const retryIn = __classPrivateFieldGet(this, _RedisSocket_options, "f").reconnectStrategy(retries, cause);
        if (retryIn !== false && !(retryIn instanceof Error) && typeof retryIn !== "number") {
          throw new TypeError(`Reconnect strategy should return \`false | Error | number\`, got ${retryIn} instead`);
        }
        return retryIn;
      } catch (err) {
        this.emit("error", err);
      }
    }
    return Math.min(retries * 50, 500);
  }, _RedisSocket_shouldReconnect = function _RedisSocket_shouldReconnect(retries, cause) {
    const retryIn = __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_reconnectStrategy).call(this, retries, cause);
    if (retryIn === false) {
      __classPrivateFieldSet(this, _RedisSocket_isOpen, false, "f");
      this.emit("error", cause);
      return cause;
    } else if (retryIn instanceof Error) {
      __classPrivateFieldSet(this, _RedisSocket_isOpen, false, "f");
      this.emit("error", cause);
      return new errors_1.ReconnectStrategyError(retryIn, cause);
    }
    return retryIn;
  }, _RedisSocket_connect = async function _RedisSocket_connect() {
    let retries = 0;
    do {
      try {
        __classPrivateFieldSet(this, _RedisSocket_socket, await __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_createSocket).call(this), "f");
        __classPrivateFieldSet(this, _RedisSocket_writableNeedDrain, false, "f");
        this.emit("connect");
        try {
          await __classPrivateFieldGet(this, _RedisSocket_initiator, "f").call(this);
        } catch (err) {
          __classPrivateFieldGet(this, _RedisSocket_socket, "f").destroy();
          __classPrivateFieldSet(this, _RedisSocket_socket, undefined, "f");
          throw err;
        }
        __classPrivateFieldSet(this, _RedisSocket_isReady, true, "f");
        this.emit("ready");
      } catch (err) {
        const retryIn = __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_shouldReconnect).call(this, retries++, err);
        if (typeof retryIn !== "number") {
          throw retryIn;
        }
        this.emit("error", err);
        await (0, utils_1.promiseTimeout)(retryIn);
        this.emit("reconnecting");
      }
    } while (__classPrivateFieldGet(this, _RedisSocket_isOpen, "f") && !__classPrivateFieldGet(this, _RedisSocket_isReady, "f"));
  }, _RedisSocket_createSocket = function _RedisSocket_createSocket() {
    return new Promise((resolve, reject) => {
      const { connectEvent, socket } = __classPrivateFieldGet(_a, _a, "m", _RedisSocket_isTlsSocket).call(_a, __classPrivateFieldGet(this, _RedisSocket_options, "f")) ? __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_createTlsSocket).call(this) : __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_createNetSocket).call(this);
      if (__classPrivateFieldGet(this, _RedisSocket_options, "f").connectTimeout) {
        socket.setTimeout(__classPrivateFieldGet(this, _RedisSocket_options, "f").connectTimeout, () => socket.destroy(new errors_1.ConnectionTimeoutError));
      }
      if (__classPrivateFieldGet(this, _RedisSocket_isSocketUnrefed, "f")) {
        socket.unref();
      }
      socket.setNoDelay(__classPrivateFieldGet(this, _RedisSocket_options, "f").noDelay).once("error", reject).once(connectEvent, () => {
        socket.setTimeout(0).setKeepAlive(__classPrivateFieldGet(this, _RedisSocket_options, "f").keepAlive !== false, __classPrivateFieldGet(this, _RedisSocket_options, "f").keepAlive || 0).off("error", reject).once("error", (err) => __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_onSocketError).call(this, err)).once("close", (hadError) => {
          if (!hadError && __classPrivateFieldGet(this, _RedisSocket_isOpen, "f") && __classPrivateFieldGet(this, _RedisSocket_socket, "f") === socket) {
            __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_onSocketError).call(this, new errors_1.SocketClosedUnexpectedlyError);
          }
        }).on("drain", () => {
          __classPrivateFieldSet(this, _RedisSocket_writableNeedDrain, false, "f");
          this.emit("drain");
        }).on("data", (data) => this.emit("data", data));
        resolve(socket);
      });
    });
  }, _RedisSocket_createNetSocket = function _RedisSocket_createNetSocket() {
    return {
      connectEvent: "connect",
      socket: net.connect(__classPrivateFieldGet(this, _RedisSocket_options, "f"))
    };
  }, _RedisSocket_createTlsSocket = function _RedisSocket_createTlsSocket() {
    return {
      connectEvent: "secureConnect",
      socket: tls.connect(__classPrivateFieldGet(this, _RedisSocket_options, "f"))
    };
  }, _RedisSocket_onSocketError = function _RedisSocket_onSocketError(err) {
    const wasReady = __classPrivateFieldGet(this, _RedisSocket_isReady, "f");
    __classPrivateFieldSet(this, _RedisSocket_isReady, false, "f");
    this.emit("error", err);
    if (!wasReady || !__classPrivateFieldGet(this, _RedisSocket_isOpen, "f") || typeof __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_shouldReconnect).call(this, 0, err) !== "number")
      return;
    this.emit("reconnecting");
    __classPrivateFieldGet(this, _RedisSocket_instances, "m", _RedisSocket_connect).call(this).catch(() => {
    });
  }, _RedisSocket_disconnect = function _RedisSocket_disconnect() {
    __classPrivateFieldSet(this, _RedisSocket_isReady, false, "f");
    if (__classPrivateFieldGet(this, _RedisSocket_socket, "f")) {
      __classPrivateFieldGet(this, _RedisSocket_socket, "f").destroy();
      __classPrivateFieldSet(this, _RedisSocket_socket, undefined, "f");
    }
    this.emit("end");
  };
  exports.default = RedisSocket;
});

// node_modules/yallist/iterator.js
var require_iterator = __commonJS((exports, module) => {
  module.exports = function(Yallist) {
    Yallist.prototype[Symbol.iterator] = function* () {
      for (let walker = this.head;walker; walker = walker.next) {
        yield walker.value;
      }
    };
  };
});

// node_modules/yallist/yallist.js
var require_yallist = __commonJS((exports, module) => {
  function Yallist(list) {
    var self = this;
    if (!(self instanceof Yallist)) {
      self = new Yallist;
    }
    self.tail = null;
    self.head = null;
    self.length = 0;
    if (list && typeof list.forEach === "function") {
      list.forEach(function(item) {
        self.push(item);
      });
    } else if (arguments.length > 0) {
      for (var i = 0, l = arguments.length;i < l; i++) {
        self.push(arguments[i]);
      }
    }
    return self;
  }
  function insert(self, node4, value) {
    var inserted = node4 === self.head ? new Node3(value, null, node4, self) : new Node3(value, node4, node4.next, self);
    if (inserted.next === null) {
      self.tail = inserted;
    }
    if (inserted.prev === null) {
      self.head = inserted;
    }
    self.length++;
    return inserted;
  }
  function push(self, item) {
    self.tail = new Node3(item, self.tail, null, self);
    if (!self.head) {
      self.head = self.tail;
    }
    self.length++;
  }
  function unshift(self, item) {
    self.head = new Node3(item, null, self.head, self);
    if (!self.tail) {
      self.tail = self.head;
    }
    self.length++;
  }
  function Node3(value, prev, next, list) {
    if (!(this instanceof Node3)) {
      return new Node3(value, prev, next, list);
    }
    this.list = list;
    this.value = value;
    if (prev) {
      prev.next = this;
      this.prev = prev;
    } else {
      this.prev = null;
    }
    if (next) {
      next.prev = this;
      this.next = next;
    } else {
      this.next = null;
    }
  }
  module.exports = Yallist;
  Yallist.Node = Node3;
  Yallist.create = Yallist;
  Yallist.prototype.removeNode = function(node4) {
    if (node4.list !== this) {
      throw new Error("removing node which does not belong to this list");
    }
    var next = node4.next;
    var prev = node4.prev;
    if (next) {
      next.prev = prev;
    }
    if (prev) {
      prev.next = next;
    }
    if (node4 === this.head) {
      this.head = next;
    }
    if (node4 === this.tail) {
      this.tail = prev;
    }
    node4.list.length--;
    node4.next = null;
    node4.prev = null;
    node4.list = null;
    return next;
  };
  Yallist.prototype.unshiftNode = function(node4) {
    if (node4 === this.head) {
      return;
    }
    if (node4.list) {
      node4.list.removeNode(node4);
    }
    var head = this.head;
    node4.list = this;
    node4.next = head;
    if (head) {
      head.prev = node4;
    }
    this.head = node4;
    if (!this.tail) {
      this.tail = node4;
    }
    this.length++;
  };
  Yallist.prototype.pushNode = function(node4) {
    if (node4 === this.tail) {
      return;
    }
    if (node4.list) {
      node4.list.removeNode(node4);
    }
    var tail = this.tail;
    node4.list = this;
    node4.prev = tail;
    if (tail) {
      tail.next = node4;
    }
    this.tail = node4;
    if (!this.head) {
      this.head = node4;
    }
    this.length++;
  };
  Yallist.prototype.push = function() {
    for (var i = 0, l = arguments.length;i < l; i++) {
      push(this, arguments[i]);
    }
    return this.length;
  };
  Yallist.prototype.unshift = function() {
    for (var i = 0, l = arguments.length;i < l; i++) {
      unshift(this, arguments[i]);
    }
    return this.length;
  };
  Yallist.prototype.pop = function() {
    if (!this.tail) {
      return;
    }
    var res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    this.length--;
    return res;
  };
  Yallist.prototype.shift = function() {
    if (!this.head) {
      return;
    }
    var res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.length--;
    return res;
  };
  Yallist.prototype.forEach = function(fn, thisp) {
    thisp = thisp || this;
    for (var walker = this.head, i = 0;walker !== null; i++) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.next;
    }
  };
  Yallist.prototype.forEachReverse = function(fn, thisp) {
    thisp = thisp || this;
    for (var walker = this.tail, i = this.length - 1;walker !== null; i--) {
      fn.call(thisp, walker.value, i, this);
      walker = walker.prev;
    }
  };
  Yallist.prototype.get = function(n) {
    for (var i = 0, walker = this.head;walker !== null && i < n; i++) {
      walker = walker.next;
    }
    if (i === n && walker !== null) {
      return walker.value;
    }
  };
  Yallist.prototype.getReverse = function(n) {
    for (var i = 0, walker = this.tail;walker !== null && i < n; i++) {
      walker = walker.prev;
    }
    if (i === n && walker !== null) {
      return walker.value;
    }
  };
  Yallist.prototype.map = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist;
    for (var walker = this.head;walker !== null; ) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.next;
    }
    return res;
  };
  Yallist.prototype.mapReverse = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist;
    for (var walker = this.tail;walker !== null; ) {
      res.push(fn.call(thisp, walker.value, this));
      walker = walker.prev;
    }
    return res;
  };
  Yallist.prototype.reduce = function(fn, initial) {
    var acc;
    var walker = this.head;
    if (arguments.length > 1) {
      acc = initial;
    } else if (this.head) {
      walker = this.head.next;
      acc = this.head.value;
    } else {
      throw new TypeError("Reduce of empty list with no initial value");
    }
    for (var i = 0;walker !== null; i++) {
      acc = fn(acc, walker.value, i);
      walker = walker.next;
    }
    return acc;
  };
  Yallist.prototype.reduceReverse = function(fn, initial) {
    var acc;
    var walker = this.tail;
    if (arguments.length > 1) {
      acc = initial;
    } else if (this.tail) {
      walker = this.tail.prev;
      acc = this.tail.value;
    } else {
      throw new TypeError("Reduce of empty list with no initial value");
    }
    for (var i = this.length - 1;walker !== null; i--) {
      acc = fn(acc, walker.value, i);
      walker = walker.prev;
    }
    return acc;
  };
  Yallist.prototype.toArray = function() {
    var arr = new Array(this.length);
    for (var i = 0, walker = this.head;walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.next;
    }
    return arr;
  };
  Yallist.prototype.toArrayReverse = function() {
    var arr = new Array(this.length);
    for (var i = 0, walker = this.tail;walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.prev;
    }
    return arr;
  };
  Yallist.prototype.slice = function(from, to) {
    to = to || this.length;
    if (to < 0) {
      to += this.length;
    }
    from = from || 0;
    if (from < 0) {
      from += this.length;
    }
    var ret = new Yallist;
    if (to < from || to < 0) {
      return ret;
    }
    if (from < 0) {
      from = 0;
    }
    if (to > this.length) {
      to = this.length;
    }
    for (var i = 0, walker = this.head;walker !== null && i < from; i++) {
      walker = walker.next;
    }
    for (;walker !== null && i < to; i++, walker = walker.next) {
      ret.push(walker.value);
    }
    return ret;
  };
  Yallist.prototype.sliceReverse = function(from, to) {
    to = to || this.length;
    if (to < 0) {
      to += this.length;
    }
    from = from || 0;
    if (from < 0) {
      from += this.length;
    }
    var ret = new Yallist;
    if (to < from || to < 0) {
      return ret;
    }
    if (from < 0) {
      from = 0;
    }
    if (to > this.length) {
      to = this.length;
    }
    for (var i = this.length, walker = this.tail;walker !== null && i > to; i--) {
      walker = walker.prev;
    }
    for (;walker !== null && i > from; i--, walker = walker.prev) {
      ret.push(walker.value);
    }
    return ret;
  };
  Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
    if (start > this.length) {
      start = this.length - 1;
    }
    if (start < 0) {
      start = this.length + start;
    }
    for (var i = 0, walker = this.head;walker !== null && i < start; i++) {
      walker = walker.next;
    }
    var ret = [];
    for (var i = 0;walker && i < deleteCount; i++) {
      ret.push(walker.value);
      walker = this.removeNode(walker);
    }
    if (walker === null) {
      walker = this.tail;
    }
    if (walker !== this.head && walker !== this.tail) {
      walker = walker.prev;
    }
    for (var i = 0;i < nodes.length; i++) {
      walker = insert(this, walker, nodes[i]);
    }
    return ret;
  };
  Yallist.prototype.reverse = function() {
    var head = this.head;
    var tail = this.tail;
    for (var walker = head;walker !== null; walker = walker.prev) {
      var p = walker.prev;
      walker.prev = walker.next;
      walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
  };
  try {
    require_iterator()(Yallist);
  } catch (er) {
  }
});

// node_modules/@redis/client/dist/lib/client/RESP2/composers/buffer.js
var require_buffer = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });

  class BufferComposer {
    constructor() {
      Object.defineProperty(this, "chunks", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
      });
    }
    write(buffer) {
      this.chunks.push(buffer);
    }
    end(buffer) {
      this.write(buffer);
      return Buffer.concat(this.chunks.splice(0));
    }
    reset() {
      this.chunks = [];
    }
  }
  exports.default = BufferComposer;
});

// node_modules/@redis/client/dist/lib/client/RESP2/composers/string.js
var require_string = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var string_decoder_1 = import.meta.require("string_decoder");

  class StringComposer {
    constructor() {
      Object.defineProperty(this, "decoder", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new string_decoder_1.StringDecoder
      });
      Object.defineProperty(this, "string", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: ""
      });
    }
    write(buffer) {
      this.string += this.decoder.write(buffer);
    }
    end(buffer) {
      const string = this.string + this.decoder.end(buffer);
      this.string = "";
      return string;
    }
    reset() {
      this.string = "";
    }
  }
  exports.default = StringComposer;
});

// node_modules/@redis/client/dist/lib/client/RESP2/decoder.js
var require_decoder = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var errors_1 = require_errors();
  var buffer_1 = require_buffer();
  var string_1 = require_string();
  var Types;
  (function(Types2) {
    Types2[Types2["SIMPLE_STRING"] = 43] = "SIMPLE_STRING";
    Types2[Types2["ERROR"] = 45] = "ERROR";
    Types2[Types2["INTEGER"] = 58] = "INTEGER";
    Types2[Types2["BULK_STRING"] = 36] = "BULK_STRING";
    Types2[Types2["ARRAY"] = 42] = "ARRAY";
  })(Types || (Types = {}));
  var ASCII;
  (function(ASCII2) {
    ASCII2[ASCII2["CR"] = 13] = "CR";
    ASCII2[ASCII2["ZERO"] = 48] = "ZERO";
    ASCII2[ASCII2["MINUS"] = 45] = "MINUS";
  })(ASCII || (ASCII = {}));

  class RESP2Decoder {
    constructor(options) {
      Object.defineProperty(this, "options", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: options
      });
      Object.defineProperty(this, "cursor", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      });
      Object.defineProperty(this, "type", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "bufferComposer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new buffer_1.default
      });
      Object.defineProperty(this, "stringComposer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new string_1.default
      });
      Object.defineProperty(this, "currentStringComposer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.stringComposer
      });
      Object.defineProperty(this, "integer", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: 0
      });
      Object.defineProperty(this, "isNegativeInteger", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "bulkStringRemainingLength", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      Object.defineProperty(this, "arraysInProcess", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
      });
      Object.defineProperty(this, "initializeArray", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: false
      });
      Object.defineProperty(this, "arrayItemType", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
    }
    reset() {
      this.cursor = 0;
      this.type = undefined;
      this.bufferComposer.reset();
      this.stringComposer.reset();
      this.currentStringComposer = this.stringComposer;
    }
    write(chunk) {
      while (this.cursor < chunk.length) {
        if (!this.type) {
          this.currentStringComposer = this.options.returnStringsAsBuffers() ? this.bufferComposer : this.stringComposer;
          this.type = chunk[this.cursor];
          if (++this.cursor >= chunk.length)
            break;
        }
        const reply = this.parseType(chunk, this.type);
        if (reply === undefined)
          break;
        this.type = undefined;
        this.options.onReply(reply);
      }
      this.cursor -= chunk.length;
    }
    parseType(chunk, type, arraysToKeep) {
      switch (type) {
        case Types.SIMPLE_STRING:
          return this.parseSimpleString(chunk);
        case Types.ERROR:
          return this.parseError(chunk);
        case Types.INTEGER:
          return this.parseInteger(chunk);
        case Types.BULK_STRING:
          return this.parseBulkString(chunk);
        case Types.ARRAY:
          return this.parseArray(chunk, arraysToKeep);
      }
    }
    compose(chunk, composer) {
      for (let i = this.cursor;i < chunk.length; i++) {
        if (chunk[i] === ASCII.CR) {
          const reply = composer.end(chunk.subarray(this.cursor, i));
          this.cursor = i + 2;
          return reply;
        }
      }
      const toWrite = chunk.subarray(this.cursor);
      composer.write(toWrite);
      this.cursor = chunk.length;
    }
    parseSimpleString(chunk) {
      return this.compose(chunk, this.currentStringComposer);
    }
    parseError(chunk) {
      const message = this.compose(chunk, this.stringComposer);
      if (message !== undefined) {
        return new errors_1.ErrorReply(message);
      }
    }
    parseInteger(chunk) {
      if (this.isNegativeInteger === undefined) {
        this.isNegativeInteger = chunk[this.cursor] === ASCII.MINUS;
        if (this.isNegativeInteger && ++this.cursor === chunk.length)
          return;
      }
      do {
        const byte = chunk[this.cursor];
        if (byte === ASCII.CR) {
          const integer = this.isNegativeInteger ? -this.integer : this.integer;
          this.integer = 0;
          this.isNegativeInteger = undefined;
          this.cursor += 2;
          return integer;
        }
        this.integer = this.integer * 10 + byte - ASCII.ZERO;
      } while (++this.cursor < chunk.length);
    }
    parseBulkString(chunk) {
      if (this.bulkStringRemainingLength === undefined) {
        const length = this.parseInteger(chunk);
        if (length === undefined)
          return;
        if (length === -1)
          return null;
        this.bulkStringRemainingLength = length;
        if (this.cursor >= chunk.length)
          return;
      }
      const end = this.cursor + this.bulkStringRemainingLength;
      if (chunk.length >= end) {
        const reply = this.currentStringComposer.end(chunk.subarray(this.cursor, end));
        this.bulkStringRemainingLength = undefined;
        this.cursor = end + 2;
        return reply;
      }
      const toWrite = chunk.subarray(this.cursor);
      this.currentStringComposer.write(toWrite);
      this.bulkStringRemainingLength -= toWrite.length;
      this.cursor = chunk.length;
    }
    parseArray(chunk, arraysToKeep = 0) {
      if (this.initializeArray || this.arraysInProcess.length === arraysToKeep) {
        const length = this.parseInteger(chunk);
        if (length === undefined) {
          this.initializeArray = true;
          return;
        }
        this.initializeArray = false;
        this.arrayItemType = undefined;
        if (length === -1) {
          return this.returnArrayReply(null, arraysToKeep, chunk);
        } else if (length === 0) {
          return this.returnArrayReply([], arraysToKeep, chunk);
        }
        this.arraysInProcess.push({
          array: new Array(length),
          pushCounter: 0
        });
      }
      while (this.cursor < chunk.length) {
        if (!this.arrayItemType) {
          this.arrayItemType = chunk[this.cursor];
          if (++this.cursor >= chunk.length)
            break;
        }
        const item = this.parseType(chunk, this.arrayItemType, arraysToKeep + 1);
        if (item === undefined)
          break;
        this.arrayItemType = undefined;
        const reply = this.pushArrayItem(item, arraysToKeep);
        if (reply !== undefined)
          return reply;
      }
    }
    returnArrayReply(reply, arraysToKeep, chunk) {
      if (this.arraysInProcess.length <= arraysToKeep)
        return reply;
      return this.pushArrayItem(reply, arraysToKeep, chunk);
    }
    pushArrayItem(item, arraysToKeep, chunk) {
      const to = this.arraysInProcess[this.arraysInProcess.length - 1];
      to.array[to.pushCounter] = item;
      if (++to.pushCounter === to.array.length) {
        return this.returnArrayReply(this.arraysInProcess.pop().array, arraysToKeep, chunk);
      } else if (chunk && chunk.length > this.cursor) {
        return this.parseArray(chunk, arraysToKeep);
      }
    }
  }
  exports.default = RESP2Decoder;
});

// node_modules/@redis/client/dist/lib/client/RESP2/encoder.js
var require_encoder = __commonJS((exports) => {
  function encodeCommand(args) {
    const toWrite = [];
    let strings = "*" + args.length + CRLF;
    for (let i = 0;i < args.length; i++) {
      const arg = args[i];
      if (typeof arg === "string") {
        strings += "$" + Buffer.byteLength(arg) + CRLF + arg + CRLF;
      } else if (arg instanceof Buffer) {
        toWrite.push(strings + "$" + arg.length.toString() + CRLF, arg);
        strings = CRLF;
      } else {
        throw new TypeError("Invalid argument type");
      }
    }
    toWrite.push(strings);
    return toWrite;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  var CRLF = "\r\n";
  exports.default = encodeCommand;
});

// node_modules/@redis/client/dist/lib/client/pub-sub.js
var require_pub_sub = __commonJS((exports) => {
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _PubSub_instances;
  var _a;
  var _PubSub_channelsArray;
  var _PubSub_listenersSet;
  var _PubSub_subscribing;
  var _PubSub_isActive;
  var _PubSub_listeners;
  var _PubSub_extendChannelListeners;
  var _PubSub_unsubscribeCommand;
  var _PubSub_updateIsActive;
  var _PubSub_emitPubSubMessage;
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.PubSub = exports.PubSubType = undefined;
  var PubSubType;
  (function(PubSubType2) {
    PubSubType2["CHANNELS"] = "CHANNELS";
    PubSubType2["PATTERNS"] = "PATTERNS";
    PubSubType2["SHARDED"] = "SHARDED";
  })(PubSubType || (exports.PubSubType = PubSubType = {}));
  var COMMANDS = {
    [PubSubType.CHANNELS]: {
      subscribe: Buffer.from("subscribe"),
      unsubscribe: Buffer.from("unsubscribe"),
      message: Buffer.from("message")
    },
    [PubSubType.PATTERNS]: {
      subscribe: Buffer.from("psubscribe"),
      unsubscribe: Buffer.from("punsubscribe"),
      message: Buffer.from("pmessage")
    },
    [PubSubType.SHARDED]: {
      subscribe: Buffer.from("ssubscribe"),
      unsubscribe: Buffer.from("sunsubscribe"),
      message: Buffer.from("smessage")
    }
  };

  class PubSub {
    constructor() {
      _PubSub_instances.add(this);
      _PubSub_subscribing.set(this, 0);
      _PubSub_isActive.set(this, false);
      _PubSub_listeners.set(this, {
        [PubSubType.CHANNELS]: new Map,
        [PubSubType.PATTERNS]: new Map,
        [PubSubType.SHARDED]: new Map
      });
    }
    static isStatusReply(reply) {
      return COMMANDS[PubSubType.CHANNELS].subscribe.equals(reply[0]) || COMMANDS[PubSubType.CHANNELS].unsubscribe.equals(reply[0]) || COMMANDS[PubSubType.PATTERNS].subscribe.equals(reply[0]) || COMMANDS[PubSubType.PATTERNS].unsubscribe.equals(reply[0]) || COMMANDS[PubSubType.SHARDED].subscribe.equals(reply[0]);
    }
    static isShardedUnsubscribe(reply) {
      return COMMANDS[PubSubType.SHARDED].unsubscribe.equals(reply[0]);
    }
    get isActive() {
      return __classPrivateFieldGet(this, _PubSub_isActive, "f");
    }
    subscribe(type, channels, listener, returnBuffers) {
      var _b;
      const args = [COMMANDS[type].subscribe], channelsArray = __classPrivateFieldGet(_a, _a, "m", _PubSub_channelsArray).call(_a, channels);
      for (const channel of channelsArray) {
        let channelListeners = __classPrivateFieldGet(this, _PubSub_listeners, "f")[type].get(channel);
        if (!channelListeners || channelListeners.unsubscribing) {
          args.push(channel);
        }
      }
      if (args.length === 1) {
        for (const channel of channelsArray) {
          __classPrivateFieldGet(_a, _a, "m", _PubSub_listenersSet).call(_a, __classPrivateFieldGet(this, _PubSub_listeners, "f")[type].get(channel), returnBuffers).add(listener);
        }
        return;
      }
      __classPrivateFieldSet(this, _PubSub_isActive, true, "f");
      __classPrivateFieldSet(this, _PubSub_subscribing, (_b = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b++, _b), "f");
      return {
        args,
        channelsCounter: args.length - 1,
        resolve: () => {
          var _b2;
          __classPrivateFieldSet(this, _PubSub_subscribing, (_b2 = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b2--, _b2), "f");
          for (const channel of channelsArray) {
            let listeners = __classPrivateFieldGet(this, _PubSub_listeners, "f")[type].get(channel);
            if (!listeners) {
              listeners = {
                unsubscribing: false,
                buffers: new Set,
                strings: new Set
              };
              __classPrivateFieldGet(this, _PubSub_listeners, "f")[type].set(channel, listeners);
            }
            __classPrivateFieldGet(_a, _a, "m", _PubSub_listenersSet).call(_a, listeners, returnBuffers).add(listener);
          }
        },
        reject: () => {
          var _b2;
          __classPrivateFieldSet(this, _PubSub_subscribing, (_b2 = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b2--, _b2), "f");
          __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_updateIsActive).call(this);
        }
      };
    }
    extendChannelListeners(type, channel, listeners) {
      var _b;
      if (!__classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_extendChannelListeners).call(this, type, channel, listeners))
        return;
      __classPrivateFieldSet(this, _PubSub_isActive, true, "f");
      __classPrivateFieldSet(this, _PubSub_subscribing, (_b = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b++, _b), "f");
      return {
        args: [
          COMMANDS[type].subscribe,
          channel
        ],
        channelsCounter: 1,
        resolve: () => {
          var _b2, _c;
          return __classPrivateFieldSet(this, _PubSub_subscribing, (_c = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b2 = _c--, _c), "f"), _b2;
        },
        reject: () => {
          var _b2;
          __classPrivateFieldSet(this, _PubSub_subscribing, (_b2 = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b2--, _b2), "f");
          __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_updateIsActive).call(this);
        }
      };
    }
    extendTypeListeners(type, listeners) {
      var _b;
      const args = [COMMANDS[type].subscribe];
      for (const [channel, channelListeners] of listeners) {
        if (__classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_extendChannelListeners).call(this, type, channel, channelListeners)) {
          args.push(channel);
        }
      }
      if (args.length === 1)
        return;
      __classPrivateFieldSet(this, _PubSub_isActive, true, "f");
      __classPrivateFieldSet(this, _PubSub_subscribing, (_b = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b++, _b), "f");
      return {
        args,
        channelsCounter: args.length - 1,
        resolve: () => {
          var _b2, _c;
          return __classPrivateFieldSet(this, _PubSub_subscribing, (_c = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b2 = _c--, _c), "f"), _b2;
        },
        reject: () => {
          var _b2;
          __classPrivateFieldSet(this, _PubSub_subscribing, (_b2 = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b2--, _b2), "f");
          __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_updateIsActive).call(this);
        }
      };
    }
    unsubscribe(type, channels, listener, returnBuffers) {
      const listeners = __classPrivateFieldGet(this, _PubSub_listeners, "f")[type];
      if (!channels) {
        return __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_unsubscribeCommand).call(this, [COMMANDS[type].unsubscribe], NaN, () => listeners.clear());
      }
      const channelsArray = __classPrivateFieldGet(_a, _a, "m", _PubSub_channelsArray).call(_a, channels);
      if (!listener) {
        return __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_unsubscribeCommand).call(this, [COMMANDS[type].unsubscribe, ...channelsArray], channelsArray.length, () => {
          for (const channel of channelsArray) {
            listeners.delete(channel);
          }
        });
      }
      const args = [COMMANDS[type].unsubscribe];
      for (const channel of channelsArray) {
        const sets = listeners.get(channel);
        if (sets) {
          let current, other;
          if (returnBuffers) {
            current = sets.buffers;
            other = sets.strings;
          } else {
            current = sets.strings;
            other = sets.buffers;
          }
          const currentSize = current.has(listener) ? current.size - 1 : current.size;
          if (currentSize !== 0 || other.size !== 0)
            continue;
          sets.unsubscribing = true;
        }
        args.push(channel);
      }
      if (args.length === 1) {
        for (const channel of channelsArray) {
          __classPrivateFieldGet(_a, _a, "m", _PubSub_listenersSet).call(_a, listeners.get(channel), returnBuffers).delete(listener);
        }
        return;
      }
      return __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_unsubscribeCommand).call(this, args, args.length - 1, () => {
        for (const channel of channelsArray) {
          const sets = listeners.get(channel);
          if (!sets)
            continue;
          (returnBuffers ? sets.buffers : sets.strings).delete(listener);
          if (sets.buffers.size === 0 && sets.strings.size === 0) {
            listeners.delete(channel);
          }
        }
      });
    }
    reset() {
      __classPrivateFieldSet(this, _PubSub_isActive, false, "f");
      __classPrivateFieldSet(this, _PubSub_subscribing, 0, "f");
    }
    resubscribe() {
      var _b;
      const commands = [];
      for (const [type, listeners] of Object.entries(__classPrivateFieldGet(this, _PubSub_listeners, "f"))) {
        if (!listeners.size)
          continue;
        __classPrivateFieldSet(this, _PubSub_isActive, true, "f");
        __classPrivateFieldSet(this, _PubSub_subscribing, (_b = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b++, _b), "f");
        const callback = () => {
          var _b2, _c;
          return __classPrivateFieldSet(this, _PubSub_subscribing, (_c = __classPrivateFieldGet(this, _PubSub_subscribing, "f"), _b2 = _c--, _c), "f"), _b2;
        };
        commands.push({
          args: [
            COMMANDS[type].subscribe,
            ...listeners.keys()
          ],
          channelsCounter: listeners.size,
          resolve: callback,
          reject: callback
        });
      }
      return commands;
    }
    handleMessageReply(reply) {
      if (COMMANDS[PubSubType.CHANNELS].message.equals(reply[0])) {
        __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_emitPubSubMessage).call(this, PubSubType.CHANNELS, reply[2], reply[1]);
        return true;
      } else if (COMMANDS[PubSubType.PATTERNS].message.equals(reply[0])) {
        __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_emitPubSubMessage).call(this, PubSubType.PATTERNS, reply[3], reply[2], reply[1]);
        return true;
      } else if (COMMANDS[PubSubType.SHARDED].message.equals(reply[0])) {
        __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_emitPubSubMessage).call(this, PubSubType.SHARDED, reply[2], reply[1]);
        return true;
      }
      return false;
    }
    removeShardedListeners(channel) {
      const listeners = __classPrivateFieldGet(this, _PubSub_listeners, "f")[PubSubType.SHARDED].get(channel);
      __classPrivateFieldGet(this, _PubSub_listeners, "f")[PubSubType.SHARDED].delete(channel);
      __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_updateIsActive).call(this);
      return listeners;
    }
    getTypeListeners(type) {
      return __classPrivateFieldGet(this, _PubSub_listeners, "f")[type];
    }
  }
  exports.PubSub = PubSub;
  _a = PubSub, _PubSub_subscribing = new WeakMap, _PubSub_isActive = new WeakMap, _PubSub_listeners = new WeakMap, _PubSub_instances = new WeakSet, _PubSub_channelsArray = function _PubSub_channelsArray(channels) {
    return Array.isArray(channels) ? channels : [channels];
  }, _PubSub_listenersSet = function _PubSub_listenersSet(listeners, returnBuffers) {
    return returnBuffers ? listeners.buffers : listeners.strings;
  }, _PubSub_extendChannelListeners = function _PubSub_extendChannelListeners(type, channel, listeners) {
    const existingListeners = __classPrivateFieldGet(this, _PubSub_listeners, "f")[type].get(channel);
    if (!existingListeners) {
      __classPrivateFieldGet(this, _PubSub_listeners, "f")[type].set(channel, listeners);
      return true;
    }
    for (const listener of listeners.buffers) {
      existingListeners.buffers.add(listener);
    }
    for (const listener of listeners.strings) {
      existingListeners.strings.add(listener);
    }
    return false;
  }, _PubSub_unsubscribeCommand = function _PubSub_unsubscribeCommand(args, channelsCounter, removeListeners) {
    return {
      args,
      channelsCounter,
      resolve: () => {
        removeListeners();
        __classPrivateFieldGet(this, _PubSub_instances, "m", _PubSub_updateIsActive).call(this);
      },
      reject: undefined
    };
  }, _PubSub_updateIsActive = function _PubSub_updateIsActive() {
    __classPrivateFieldSet(this, _PubSub_isActive, __classPrivateFieldGet(this, _PubSub_listeners, "f")[PubSubType.CHANNELS].size !== 0 || __classPrivateFieldGet(this, _PubSub_listeners, "f")[PubSubType.PATTERNS].size !== 0 || __classPrivateFieldGet(this, _PubSub_listeners, "f")[PubSubType.SHARDED].size !== 0 || __classPrivateFieldGet(this, _PubSub_subscribing, "f") !== 0, "f");
  }, _PubSub_emitPubSubMessage = function _PubSub_emitPubSubMessage(type, message, channel, pattern) {
    const keyString = (pattern ?? channel).toString(), listeners = __classPrivateFieldGet(this, _PubSub_listeners, "f")[type].get(keyString);
    if (!listeners)
      return;
    for (const listener of listeners.buffers) {
      listener(message, channel);
    }
    if (!listeners.strings.size)
      return;
    const channelString = pattern ? channel.toString() : keyString, messageString = channelString === "__redis__:invalidate" ? message === null ? null : message.map((x) => x.toString()) : message.toString();
    for (const listener of listeners.strings) {
      listener(messageString, channelString);
    }
  };
});

// node_modules/@redis/client/dist/lib/client/commands-queue.js
var require_commands_queue = __commonJS((exports) => {
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _RedisCommandsQueue_instances;
  var _a;
  var _RedisCommandsQueue_flushQueue;
  var _RedisCommandsQueue_maxLength;
  var _RedisCommandsQueue_waitingToBeSent;
  var _RedisCommandsQueue_waitingForReply;
  var _RedisCommandsQueue_onShardedChannelMoved;
  var _RedisCommandsQueue_pubSub;
  var _RedisCommandsQueue_chainInExecution;
  var _RedisCommandsQueue_decoder;
  var _RedisCommandsQueue_pushPubSubCommand;
  Object.defineProperty(exports, "__esModule", { value: true });
  var LinkedList = require_yallist();
  var errors_1 = require_errors();
  var decoder_1 = require_decoder();
  var encoder_1 = require_encoder();
  var pub_sub_1 = require_pub_sub();
  var PONG = Buffer.from("pong");

  class RedisCommandsQueue {
    get isPubSubActive() {
      return __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").isActive;
    }
    constructor(maxLength, onShardedChannelMoved) {
      _RedisCommandsQueue_instances.add(this);
      _RedisCommandsQueue_maxLength.set(this, undefined);
      _RedisCommandsQueue_waitingToBeSent.set(this, new LinkedList);
      _RedisCommandsQueue_waitingForReply.set(this, new LinkedList);
      _RedisCommandsQueue_onShardedChannelMoved.set(this, undefined);
      _RedisCommandsQueue_pubSub.set(this, new pub_sub_1.PubSub);
      _RedisCommandsQueue_chainInExecution.set(this, undefined);
      _RedisCommandsQueue_decoder.set(this, new decoder_1.default({
        returnStringsAsBuffers: () => {
          return !!__classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").head?.value.returnBuffers || __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").isActive;
        },
        onReply: (reply) => {
          if (__classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").isActive && Array.isArray(reply)) {
            if (__classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").handleMessageReply(reply))
              return;
            const isShardedUnsubscribe = pub_sub_1.PubSub.isShardedUnsubscribe(reply);
            if (isShardedUnsubscribe && !__classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").length) {
              const channel = reply[1].toString();
              __classPrivateFieldGet(this, _RedisCommandsQueue_onShardedChannelMoved, "f").call(this, channel, __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").removeShardedListeners(channel));
              return;
            } else if (isShardedUnsubscribe || pub_sub_1.PubSub.isStatusReply(reply)) {
              const head = __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").head.value;
              if (Number.isNaN(head.channelsCounter) && reply[2] === 0 || --head.channelsCounter === 0) {
                __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").shift().resolve();
              }
              return;
            }
            if (PONG.equals(reply[0])) {
              const { resolve: resolve2, returnBuffers } = __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").shift(), buffer = reply[1].length === 0 ? reply[0] : reply[1];
              resolve2(returnBuffers ? buffer : buffer.toString());
              return;
            }
          }
          const { resolve, reject } = __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").shift();
          if (reply instanceof errors_1.ErrorReply) {
            reject(reply);
          } else {
            resolve(reply);
          }
        }
      }));
      __classPrivateFieldSet(this, _RedisCommandsQueue_maxLength, maxLength, "f");
      __classPrivateFieldSet(this, _RedisCommandsQueue_onShardedChannelMoved, onShardedChannelMoved, "f");
    }
    addCommand(args, options) {
      if (__classPrivateFieldGet(this, _RedisCommandsQueue_maxLength, "f") && __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").length + __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").length >= __classPrivateFieldGet(this, _RedisCommandsQueue_maxLength, "f")) {
        return Promise.reject(new Error("The queue is full"));
      } else if (options?.signal?.aborted) {
        return Promise.reject(new errors_1.AbortError);
      }
      return new Promise((resolve, reject) => {
        const node4 = new LinkedList.Node({
          args,
          chainId: options?.chainId,
          returnBuffers: options?.returnBuffers,
          resolve,
          reject
        });
        if (options?.signal) {
          const listener = () => {
            __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").removeNode(node4);
            node4.value.reject(new errors_1.AbortError);
          };
          node4.value.abort = {
            signal: options.signal,
            listener
          };
          options.signal.addEventListener("abort", listener, {
            once: true
          });
        }
        if (options?.asap) {
          __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").unshiftNode(node4);
        } else {
          __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").pushNode(node4);
        }
      });
    }
    subscribe(type, channels, listener, returnBuffers) {
      return __classPrivateFieldGet(this, _RedisCommandsQueue_instances, "m", _RedisCommandsQueue_pushPubSubCommand).call(this, __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").subscribe(type, channels, listener, returnBuffers));
    }
    unsubscribe(type, channels, listener, returnBuffers) {
      return __classPrivateFieldGet(this, _RedisCommandsQueue_instances, "m", _RedisCommandsQueue_pushPubSubCommand).call(this, __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").unsubscribe(type, channels, listener, returnBuffers));
    }
    resubscribe() {
      const commands = __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").resubscribe();
      if (!commands.length)
        return;
      return Promise.all(commands.map((command) => __classPrivateFieldGet(this, _RedisCommandsQueue_instances, "m", _RedisCommandsQueue_pushPubSubCommand).call(this, command)));
    }
    extendPubSubChannelListeners(type, channel, listeners) {
      return __classPrivateFieldGet(this, _RedisCommandsQueue_instances, "m", _RedisCommandsQueue_pushPubSubCommand).call(this, __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").extendChannelListeners(type, channel, listeners));
    }
    extendPubSubListeners(type, listeners) {
      return __classPrivateFieldGet(this, _RedisCommandsQueue_instances, "m", _RedisCommandsQueue_pushPubSubCommand).call(this, __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").extendTypeListeners(type, listeners));
    }
    getPubSubListeners(type) {
      return __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").getTypeListeners(type);
    }
    getCommandToSend() {
      const toSend = __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").shift();
      if (!toSend)
        return;
      let encoded;
      try {
        encoded = (0, encoder_1.default)(toSend.args);
      } catch (err) {
        toSend.reject(err);
        return;
      }
      __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f").push({
        resolve: toSend.resolve,
        reject: toSend.reject,
        channelsCounter: toSend.channelsCounter,
        returnBuffers: toSend.returnBuffers
      });
      __classPrivateFieldSet(this, _RedisCommandsQueue_chainInExecution, toSend.chainId, "f");
      return encoded;
    }
    onReplyChunk(chunk) {
      __classPrivateFieldGet(this, _RedisCommandsQueue_decoder, "f").write(chunk);
    }
    flushWaitingForReply(err) {
      __classPrivateFieldGet(this, _RedisCommandsQueue_decoder, "f").reset();
      __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").reset();
      __classPrivateFieldGet(_a, _a, "m", _RedisCommandsQueue_flushQueue).call(_a, __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f"), err);
      if (!__classPrivateFieldGet(this, _RedisCommandsQueue_chainInExecution, "f"))
        return;
      while (__classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").head?.value.chainId === __classPrivateFieldGet(this, _RedisCommandsQueue_chainInExecution, "f")) {
        __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").shift();
      }
      __classPrivateFieldSet(this, _RedisCommandsQueue_chainInExecution, undefined, "f");
    }
    flushAll(err) {
      __classPrivateFieldGet(this, _RedisCommandsQueue_decoder, "f").reset();
      __classPrivateFieldGet(this, _RedisCommandsQueue_pubSub, "f").reset();
      __classPrivateFieldGet(_a, _a, "m", _RedisCommandsQueue_flushQueue).call(_a, __classPrivateFieldGet(this, _RedisCommandsQueue_waitingForReply, "f"), err);
      __classPrivateFieldGet(_a, _a, "m", _RedisCommandsQueue_flushQueue).call(_a, __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f"), err);
    }
  }
  _a = RedisCommandsQueue, _RedisCommandsQueue_maxLength = new WeakMap, _RedisCommandsQueue_waitingToBeSent = new WeakMap, _RedisCommandsQueue_waitingForReply = new WeakMap, _RedisCommandsQueue_onShardedChannelMoved = new WeakMap, _RedisCommandsQueue_pubSub = new WeakMap, _RedisCommandsQueue_chainInExecution = new WeakMap, _RedisCommandsQueue_decoder = new WeakMap, _RedisCommandsQueue_instances = new WeakSet, _RedisCommandsQueue_flushQueue = function _RedisCommandsQueue_flushQueue(queue, err) {
    while (queue.length) {
      queue.shift().reject(err);
    }
  }, _RedisCommandsQueue_pushPubSubCommand = function _RedisCommandsQueue_pushPubSubCommand(command) {
    if (command === undefined)
      return;
    return new Promise((resolve, reject) => {
      __classPrivateFieldGet(this, _RedisCommandsQueue_waitingToBeSent, "f").push({
        args: command.args,
        channelsCounter: command.channelsCounter,
        returnBuffers: true,
        resolve: () => {
          command.resolve();
          resolve();
        },
        reject: (err) => {
          command.reject?.();
          reject(err);
        }
      });
    });
  };
  exports.default = RedisCommandsQueue;
});

// node_modules/@redis/client/dist/lib/command-options.js
var require_command_options = __commonJS((exports) => {
  function commandOptions(options) {
    options[symbol] = true;
    return options;
  }
  function isCommandOptions(options) {
    return options?.[symbol] === true;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.isCommandOptions = exports.commandOptions = undefined;
  var symbol = Symbol("Command Options");
  exports.commandOptions = commandOptions;
  exports.isCommandOptions = isCommandOptions;
});

// node_modules/@redis/client/dist/lib/commander.js
var require_commander = __commonJS((exports) => {
  function attachCommands({ BaseClass, commands, executor }) {
    for (const [name, command] of Object.entries(commands)) {
      BaseClass.prototype[name] = function(...args) {
        return executor.call(this, command, args, name);
      };
    }
  }
  function attachExtensions(config2) {
    let Commander;
    if (config2.modules) {
      Commander = attachWithNamespaces({
        BaseClass: config2.BaseClass,
        namespaces: config2.modules,
        executor: config2.modulesExecutor
      });
    }
    if (config2.functions) {
      Commander = attachWithNamespaces({
        BaseClass: Commander ?? config2.BaseClass,
        namespaces: config2.functions,
        executor: config2.functionsExecutor
      });
    }
    if (config2.scripts) {
      Commander ?? (Commander = class extends config2.BaseClass {
      });
      attachCommands({
        BaseClass: Commander,
        commands: config2.scripts,
        executor: config2.scriptsExecutor
      });
    }
    return Commander ?? config2.BaseClass;
  }
  function attachWithNamespaces({ BaseClass, namespaces, executor }) {
    const Commander = class extends BaseClass {
      constructor(...args) {
        super(...args);
        for (const namespace of Object.keys(namespaces)) {
          this[namespace] = Object.create(this[namespace], {
            self: {
              value: this
            }
          });
        }
      }
    };
    for (const [namespace, commands] of Object.entries(namespaces)) {
      Commander.prototype[namespace] = {};
      for (const [name, command] of Object.entries(commands)) {
        Commander.prototype[namespace][name] = function(...args) {
          return executor.call(this.self, command, args, name);
        };
      }
    }
    return Commander;
  }
  function transformCommandArguments(command, args) {
    let options;
    if ((0, command_options_1.isCommandOptions)(args[0])) {
      options = args[0];
      args = args.slice(1);
    }
    return {
      jsArgs: args,
      args: command.transformArguments(...args),
      options
    };
  }
  function transformLegacyCommandArguments(args) {
    return args.flat().map((arg) => {
      return typeof arg === "number" || arg instanceof Date ? arg.toString() : arg;
    });
  }
  function transformCommandReply(command, rawReply, preserved) {
    if (!command.transformReply) {
      return rawReply;
    }
    return command.transformReply(rawReply, preserved);
  }
  function fCallArguments(name, fn, args) {
    const actualArgs = [
      fn.IS_READ_ONLY ? "FCALL_RO" : "FCALL",
      name
    ];
    if (fn.NUMBER_OF_KEYS !== undefined) {
      actualArgs.push(fn.NUMBER_OF_KEYS.toString());
    }
    actualArgs.push(...args);
    return actualArgs;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.fCallArguments = exports.transformCommandReply = exports.transformLegacyCommandArguments = exports.transformCommandArguments = exports.attachExtensions = exports.attachCommands = undefined;
  var command_options_1 = require_command_options();
  exports.attachCommands = attachCommands;
  exports.attachExtensions = attachExtensions;
  exports.transformCommandArguments = transformCommandArguments;
  exports.transformLegacyCommandArguments = transformLegacyCommandArguments;
  exports.transformCommandReply = transformCommandReply;
  exports.fCallArguments = fCallArguments;
});

// node_modules/@redis/client/dist/lib/multi-command.js
var require_multi_command = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var commander_1 = require_commander();
  var errors_1 = require_errors();

  class RedisMultiCommand {
    constructor() {
      Object.defineProperty(this, "queue", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: []
      });
      Object.defineProperty(this, "scriptsInUse", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Set
      });
    }
    static generateChainId() {
      return Symbol("RedisMultiCommand Chain Id");
    }
    addCommand(args, transformReply) {
      this.queue.push({
        args,
        transformReply
      });
    }
    addFunction(name, fn, args) {
      const transformedArguments = (0, commander_1.fCallArguments)(name, fn, fn.transformArguments(...args));
      this.queue.push({
        args: transformedArguments,
        transformReply: fn.transformReply
      });
      return transformedArguments;
    }
    addScript(script, args) {
      const transformedArguments = [];
      if (this.scriptsInUse.has(script.SHA1)) {
        transformedArguments.push("EVALSHA", script.SHA1);
      } else {
        this.scriptsInUse.add(script.SHA1);
        transformedArguments.push("EVAL", script.SCRIPT);
      }
      if (script.NUMBER_OF_KEYS !== undefined) {
        transformedArguments.push(script.NUMBER_OF_KEYS.toString());
      }
      const scriptArguments = script.transformArguments(...args);
      transformedArguments.push(...scriptArguments);
      if (scriptArguments.preserve) {
        transformedArguments.preserve = scriptArguments.preserve;
      }
      this.addCommand(transformedArguments, script.transformReply);
      return transformedArguments;
    }
    handleExecReplies(rawReplies) {
      const execReply = rawReplies[rawReplies.length - 1];
      if (execReply === null) {
        throw new errors_1.WatchError;
      }
      return this.transformReplies(execReply);
    }
    transformReplies(rawReplies) {
      const errorIndexes = [], replies = rawReplies.map((reply, i) => {
        if (reply instanceof errors_1.ErrorReply) {
          errorIndexes.push(i);
          return reply;
        }
        const { transformReply, args } = this.queue[i];
        return transformReply ? transformReply(reply, args.preserve) : reply;
      });
      if (errorIndexes.length)
        throw new errors_1.MultiErrorReply(replies, errorIndexes);
      return replies;
    }
  }
  exports.default = RedisMultiCommand;
});

// node_modules/@redis/client/dist/lib/client/multi-command.js
var require_multi_command2 = __commonJS((exports) => {
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _RedisClientMultiCommand_instances;
  var _RedisClientMultiCommand_multi;
  var _RedisClientMultiCommand_executor;
  var _RedisClientMultiCommand_selectedDB;
  var _RedisClientMultiCommand_legacyMode;
  var _RedisClientMultiCommand_defineLegacyCommand;
  Object.defineProperty(exports, "__esModule", { value: true });
  var commands_1 = require_commands2();
  var multi_command_1 = require_multi_command();
  var commander_1 = require_commander();

  class RedisClientMultiCommand {
    static extend(extensions) {
      return (0, commander_1.attachExtensions)({
        BaseClass: RedisClientMultiCommand,
        modulesExecutor: RedisClientMultiCommand.prototype.commandsExecutor,
        modules: extensions?.modules,
        functionsExecutor: RedisClientMultiCommand.prototype.functionsExecutor,
        functions: extensions?.functions,
        scriptsExecutor: RedisClientMultiCommand.prototype.scriptsExecutor,
        scripts: extensions?.scripts
      });
    }
    constructor(executor, legacyMode = false) {
      _RedisClientMultiCommand_instances.add(this);
      _RedisClientMultiCommand_multi.set(this, new multi_command_1.default);
      _RedisClientMultiCommand_executor.set(this, undefined);
      Object.defineProperty(this, "v4", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: {}
      });
      _RedisClientMultiCommand_selectedDB.set(this, undefined);
      Object.defineProperty(this, "select", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SELECT
      });
      Object.defineProperty(this, "EXEC", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.exec
      });
      __classPrivateFieldSet(this, _RedisClientMultiCommand_executor, executor, "f");
      if (legacyMode) {
        __classPrivateFieldGet(this, _RedisClientMultiCommand_instances, "m", _RedisClientMultiCommand_legacyMode).call(this);
      }
    }
    commandsExecutor(command, args) {
      return this.addCommand(command.transformArguments(...args), command.transformReply);
    }
    SELECT(db, transformReply) {
      __classPrivateFieldSet(this, _RedisClientMultiCommand_selectedDB, db, "f");
      return this.addCommand(["SELECT", db.toString()], transformReply);
    }
    addCommand(args, transformReply) {
      __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").addCommand(args, transformReply);
      return this;
    }
    functionsExecutor(fn, args, name) {
      __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").addFunction(name, fn, args);
      return this;
    }
    scriptsExecutor(script, args) {
      __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").addScript(script, args);
      return this;
    }
    async exec(execAsPipeline = false) {
      if (execAsPipeline) {
        return this.execAsPipeline();
      }
      return __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").handleExecReplies(await __classPrivateFieldGet(this, _RedisClientMultiCommand_executor, "f").call(this, __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").queue, __classPrivateFieldGet(this, _RedisClientMultiCommand_selectedDB, "f"), multi_command_1.default.generateChainId()));
    }
    async execAsPipeline() {
      if (__classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").queue.length === 0)
        return [];
      return __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").transformReplies(await __classPrivateFieldGet(this, _RedisClientMultiCommand_executor, "f").call(this, __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").queue, __classPrivateFieldGet(this, _RedisClientMultiCommand_selectedDB, "f")));
    }
  }
  _RedisClientMultiCommand_multi = new WeakMap, _RedisClientMultiCommand_executor = new WeakMap, _RedisClientMultiCommand_selectedDB = new WeakMap, _RedisClientMultiCommand_instances = new WeakSet, _RedisClientMultiCommand_legacyMode = function _RedisClientMultiCommand_legacyMode() {
    var _a, _b;
    this.v4.addCommand = this.addCommand.bind(this);
    this.addCommand = (...args) => {
      __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").addCommand((0, commander_1.transformLegacyCommandArguments)(args));
      return this;
    };
    this.v4.exec = this.exec.bind(this);
    this.exec = (callback) => {
      this.v4.exec().then((reply) => {
        if (!callback)
          return;
        callback(null, reply);
      }).catch((err) => {
        if (!callback) {
          return;
        }
        callback(err);
      });
    };
    for (const [name, command] of Object.entries(commands_1.default)) {
      __classPrivateFieldGet(this, _RedisClientMultiCommand_instances, "m", _RedisClientMultiCommand_defineLegacyCommand).call(this, name, command);
      (_a = this)[_b = name.toLowerCase()] ?? (_a[_b] = this[name]);
    }
  }, _RedisClientMultiCommand_defineLegacyCommand = function _RedisClientMultiCommand_defineLegacyCommand(name, command) {
    this.v4[name] = this[name].bind(this.v4);
    this[name] = command && command.TRANSFORM_LEGACY_REPLY && command.transformReply ? (...args) => {
      __classPrivateFieldGet(this, _RedisClientMultiCommand_multi, "f").addCommand([name, ...(0, commander_1.transformLegacyCommandArguments)(args)], command.transformReply);
      return this;
    } : (...args) => this.addCommand(name, ...args);
  };
  exports.default = RedisClientMultiCommand;
  (0, commander_1.attachCommands)({
    BaseClass: RedisClientMultiCommand,
    commands: commands_1.default,
    executor: RedisClientMultiCommand.prototype.commandsExecutor
  });
});

// node_modules/generic-pool/lib/factoryValidator.js
var require_factoryValidator = __commonJS((exports, module) => {
  module.exports = function(factory) {
    if (typeof factory.create !== "function") {
      throw new TypeError("factory.create must be a function");
    }
    if (typeof factory.destroy !== "function") {
      throw new TypeError("factory.destroy must be a function");
    }
    if (typeof factory.validate !== "undefined" && typeof factory.validate !== "function") {
      throw new TypeError("factory.validate must be a function");
    }
  };
});

// node_modules/generic-pool/lib/PoolDefaults.js
var require_PoolDefaults = __commonJS((exports, module) => {
  class PoolDefaults {
    constructor() {
      this.fifo = true;
      this.priorityRange = 1;
      this.testOnBorrow = false;
      this.testOnReturn = false;
      this.autostart = true;
      this.evictionRunIntervalMillis = 0;
      this.numTestsPerEvictionRun = 3;
      this.softIdleTimeoutMillis = -1;
      this.idleTimeoutMillis = 30000;
      this.acquireTimeoutMillis = null;
      this.destroyTimeoutMillis = null;
      this.maxWaitingClients = null;
      this.min = null;
      this.max = null;
      this.Promise = Promise;
    }
  }
  module.exports = PoolDefaults;
});

// node_modules/generic-pool/lib/PoolOptions.js
var require_PoolOptions = __commonJS((exports, module) => {
  var PoolDefaults = require_PoolDefaults();

  class PoolOptions {
    constructor(opts) {
      const poolDefaults = new PoolDefaults;
      opts = opts || {};
      this.fifo = typeof opts.fifo === "boolean" ? opts.fifo : poolDefaults.fifo;
      this.priorityRange = opts.priorityRange || poolDefaults.priorityRange;
      this.testOnBorrow = typeof opts.testOnBorrow === "boolean" ? opts.testOnBorrow : poolDefaults.testOnBorrow;
      this.testOnReturn = typeof opts.testOnReturn === "boolean" ? opts.testOnReturn : poolDefaults.testOnReturn;
      this.autostart = typeof opts.autostart === "boolean" ? opts.autostart : poolDefaults.autostart;
      if (opts.acquireTimeoutMillis) {
        this.acquireTimeoutMillis = parseInt(opts.acquireTimeoutMillis, 10);
      }
      if (opts.destroyTimeoutMillis) {
        this.destroyTimeoutMillis = parseInt(opts.destroyTimeoutMillis, 10);
      }
      if (opts.maxWaitingClients !== undefined) {
        this.maxWaitingClients = parseInt(opts.maxWaitingClients, 10);
      }
      this.max = parseInt(opts.max, 10);
      this.min = parseInt(opts.min, 10);
      this.max = Math.max(isNaN(this.max) ? 1 : this.max, 1);
      this.min = Math.min(isNaN(this.min) ? 0 : this.min, this.max);
      this.evictionRunIntervalMillis = opts.evictionRunIntervalMillis || poolDefaults.evictionRunIntervalMillis;
      this.numTestsPerEvictionRun = opts.numTestsPerEvictionRun || poolDefaults.numTestsPerEvictionRun;
      this.softIdleTimeoutMillis = opts.softIdleTimeoutMillis || poolDefaults.softIdleTimeoutMillis;
      this.idleTimeoutMillis = opts.idleTimeoutMillis || poolDefaults.idleTimeoutMillis;
      this.Promise = opts.Promise != null ? opts.Promise : poolDefaults.Promise;
    }
  }
  module.exports = PoolOptions;
});

// node_modules/generic-pool/lib/Deferred.js
var require_Deferred = __commonJS((exports, module) => {
  class Deferred {
    constructor(Promise2) {
      this._state = Deferred.PENDING;
      this._resolve = undefined;
      this._reject = undefined;
      this._promise = new Promise2((resolve, reject) => {
        this._resolve = resolve;
        this._reject = reject;
      });
    }
    get state() {
      return this._state;
    }
    get promise() {
      return this._promise;
    }
    reject(reason) {
      if (this._state !== Deferred.PENDING) {
        return;
      }
      this._state = Deferred.REJECTED;
      this._reject(reason);
    }
    resolve(value) {
      if (this._state !== Deferred.PENDING) {
        return;
      }
      this._state = Deferred.FULFILLED;
      this._resolve(value);
    }
  }
  Deferred.PENDING = "PENDING";
  Deferred.FULFILLED = "FULFILLED";
  Deferred.REJECTED = "REJECTED";
  module.exports = Deferred;
});

// node_modules/generic-pool/lib/errors.js
var require_errors2 = __commonJS((exports, module) => {
  class ExtendableError extends Error {
    constructor(message) {
      super(message);
      this.name = this.constructor.name;
      this.message = message;
      if (typeof Error.captureStackTrace === "function") {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = new Error(message).stack;
      }
    }
  }

  class TimeoutError extends ExtendableError {
    constructor(m) {
      super(m);
    }
  }
  module.exports = {
    TimeoutError
  };
});

// node_modules/generic-pool/lib/ResourceRequest.js
var require_ResourceRequest = __commonJS((exports, module) => {
  function fbind(fn, ctx) {
    return function bound() {
      return fn.apply(ctx, arguments);
    };
  }
  var Deferred = require_Deferred();
  var errors = require_errors2();

  class ResourceRequest extends Deferred {
    constructor(ttl, Promise2) {
      super(Promise2);
      this._creationTimestamp = Date.now();
      this._timeout = null;
      if (ttl !== undefined) {
        this.setTimeout(ttl);
      }
    }
    setTimeout(delay) {
      if (this._state !== ResourceRequest.PENDING) {
        return;
      }
      const ttl = parseInt(delay, 10);
      if (isNaN(ttl) || ttl <= 0) {
        throw new Error("delay must be a positive int");
      }
      const age = Date.now() - this._creationTimestamp;
      if (this._timeout) {
        this.removeTimeout();
      }
      this._timeout = setTimeout(fbind(this._fireTimeout, this), Math.max(ttl - age, 0));
    }
    removeTimeout() {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      this._timeout = null;
    }
    _fireTimeout() {
      this.reject(new errors.TimeoutError("ResourceRequest timed out"));
    }
    reject(reason) {
      this.removeTimeout();
      super.reject(reason);
    }
    resolve(value) {
      this.removeTimeout();
      super.resolve(value);
    }
  }
  module.exports = ResourceRequest;
});

// node_modules/generic-pool/lib/ResourceLoan.js
var require_ResourceLoan = __commonJS((exports, module) => {
  var Deferred = require_Deferred();

  class ResourceLoan extends Deferred {
    constructor(pooledResource, Promise2) {
      super(Promise2);
      this._creationTimestamp = Date.now();
      this.pooledResource = pooledResource;
    }
    reject() {
    }
  }
  module.exports = ResourceLoan;
});

// node_modules/generic-pool/lib/PooledResourceStateEnum.js
var require_PooledResourceStateEnum = __commonJS((exports, module) => {
  var PooledResourceStateEnum = {
    ALLOCATED: "ALLOCATED",
    IDLE: "IDLE",
    INVALID: "INVALID",
    RETURNING: "RETURNING",
    VALIDATION: "VALIDATION"
  };
  module.exports = PooledResourceStateEnum;
});

// node_modules/generic-pool/lib/PooledResource.js
var require_PooledResource = __commonJS((exports, module) => {
  var PooledResourceStateEnum = require_PooledResourceStateEnum();

  class PooledResource {
    constructor(resource) {
      this.creationTime = Date.now();
      this.lastReturnTime = null;
      this.lastBorrowTime = null;
      this.lastIdleTime = null;
      this.obj = resource;
      this.state = PooledResourceStateEnum.IDLE;
    }
    allocate() {
      this.lastBorrowTime = Date.now();
      this.state = PooledResourceStateEnum.ALLOCATED;
    }
    deallocate() {
      this.lastReturnTime = Date.now();
      this.state = PooledResourceStateEnum.IDLE;
    }
    invalidate() {
      this.state = PooledResourceStateEnum.INVALID;
    }
    test() {
      this.state = PooledResourceStateEnum.VALIDATION;
    }
    idle() {
      this.lastIdleTime = Date.now();
      this.state = PooledResourceStateEnum.IDLE;
    }
    returning() {
      this.state = PooledResourceStateEnum.RETURNING;
    }
  }
  module.exports = PooledResource;
});

// node_modules/generic-pool/lib/DefaultEvictor.js
var require_DefaultEvictor = __commonJS((exports, module) => {
  class DefaultEvictor {
    evict(config2, pooledResource, availableObjectsCount) {
      const idleTime = Date.now() - pooledResource.lastIdleTime;
      if (config2.softIdleTimeoutMillis > 0 && config2.softIdleTimeoutMillis < idleTime && config2.min < availableObjectsCount) {
        return true;
      }
      if (config2.idleTimeoutMillis < idleTime) {
        return true;
      }
      return false;
    }
  }
  module.exports = DefaultEvictor;
});

// node_modules/generic-pool/lib/DoublyLinkedList.js
var require_DoublyLinkedList = __commonJS((exports, module) => {
  class DoublyLinkedList {
    constructor() {
      this.head = null;
      this.tail = null;
      this.length = 0;
    }
    insertBeginning(node4) {
      if (this.head === null) {
        this.head = node4;
        this.tail = node4;
        node4.prev = null;
        node4.next = null;
        this.length++;
      } else {
        this.insertBefore(this.head, node4);
      }
    }
    insertEnd(node4) {
      if (this.tail === null) {
        this.insertBeginning(node4);
      } else {
        this.insertAfter(this.tail, node4);
      }
    }
    insertAfter(node4, newNode) {
      newNode.prev = node4;
      newNode.next = node4.next;
      if (node4.next === null) {
        this.tail = newNode;
      } else {
        node4.next.prev = newNode;
      }
      node4.next = newNode;
      this.length++;
    }
    insertBefore(node4, newNode) {
      newNode.prev = node4.prev;
      newNode.next = node4;
      if (node4.prev === null) {
        this.head = newNode;
      } else {
        node4.prev.next = newNode;
      }
      node4.prev = newNode;
      this.length++;
    }
    remove(node4) {
      if (node4.prev === null) {
        this.head = node4.next;
      } else {
        node4.prev.next = node4.next;
      }
      if (node4.next === null) {
        this.tail = node4.prev;
      } else {
        node4.next.prev = node4.prev;
      }
      node4.prev = null;
      node4.next = null;
      this.length--;
    }
    static createNode(data) {
      return {
        prev: null,
        next: null,
        data
      };
    }
  }
  module.exports = DoublyLinkedList;
});

// node_modules/generic-pool/lib/DoublyLinkedListIterator.js
var require_DoublyLinkedListIterator = __commonJS((exports, module) => {
  class DoublyLinkedListIterator {
    constructor(doublyLinkedList, reverse) {
      this._list = doublyLinkedList;
      this._direction = reverse === true ? "prev" : "next";
      this._startPosition = reverse === true ? "tail" : "head";
      this._started = false;
      this._cursor = null;
      this._done = false;
    }
    _start() {
      this._cursor = this._list[this._startPosition];
      this._started = true;
    }
    _advanceCursor() {
      if (this._started === false) {
        this._started = true;
        this._cursor = this._list[this._startPosition];
        return;
      }
      this._cursor = this._cursor[this._direction];
    }
    reset() {
      this._done = false;
      this._started = false;
      this._cursor = null;
    }
    remove() {
      if (this._started === false || this._done === true || this._isCursorDetached()) {
        return false;
      }
      this._list.remove(this._cursor);
    }
    next() {
      if (this._done === true) {
        return { done: true };
      }
      this._advanceCursor();
      if (this._cursor === null || this._isCursorDetached()) {
        this._done = true;
        return { done: true };
      }
      return {
        value: this._cursor,
        done: false
      };
    }
    _isCursorDetached() {
      return this._cursor.prev === null && this._cursor.next === null && this._list.tail !== this._cursor && this._list.head !== this._cursor;
    }
  }
  module.exports = DoublyLinkedListIterator;
});

// node_modules/generic-pool/lib/DequeIterator.js
var require_DequeIterator = __commonJS((exports, module) => {
  var DoublyLinkedListIterator = require_DoublyLinkedListIterator();

  class DequeIterator extends DoublyLinkedListIterator {
    next() {
      const result = super.next();
      if (result.value) {
        result.value = result.value.data;
      }
      return result;
    }
  }
  module.exports = DequeIterator;
});

// node_modules/generic-pool/lib/Deque.js
var require_Deque = __commonJS((exports, module) => {
  var DoublyLinkedList = require_DoublyLinkedList();
  var DequeIterator = require_DequeIterator();

  class Deque {
    constructor() {
      this._list = new DoublyLinkedList;
    }
    shift() {
      if (this.length === 0) {
        return;
      }
      const node4 = this._list.head;
      this._list.remove(node4);
      return node4.data;
    }
    unshift(element) {
      const node4 = DoublyLinkedList.createNode(element);
      this._list.insertBeginning(node4);
    }
    push(element) {
      const node4 = DoublyLinkedList.createNode(element);
      this._list.insertEnd(node4);
    }
    pop() {
      if (this.length === 0) {
        return;
      }
      const node4 = this._list.tail;
      this._list.remove(node4);
      return node4.data;
    }
    [Symbol.iterator]() {
      return new DequeIterator(this._list);
    }
    iterator() {
      return new DequeIterator(this._list);
    }
    reverseIterator() {
      return new DequeIterator(this._list, true);
    }
    get head() {
      if (this.length === 0) {
        return;
      }
      const node4 = this._list.head;
      return node4.data;
    }
    get tail() {
      if (this.length === 0) {
        return;
      }
      const node4 = this._list.tail;
      return node4.data;
    }
    get length() {
      return this._list.length;
    }
  }
  module.exports = Deque;
});

// node_modules/generic-pool/lib/Queue.js
var require_Queue = __commonJS((exports, module) => {
  var DoublyLinkedList = require_DoublyLinkedList();
  var Deque = require_Deque();

  class Queue extends Deque {
    push(resourceRequest) {
      const node4 = DoublyLinkedList.createNode(resourceRequest);
      resourceRequest.promise.catch(this._createTimeoutRejectionHandler(node4));
      this._list.insertEnd(node4);
    }
    _createTimeoutRejectionHandler(node4) {
      return (reason) => {
        if (reason.name === "TimeoutError") {
          this._list.remove(node4);
        }
      };
    }
  }
  module.exports = Queue;
});

// node_modules/generic-pool/lib/PriorityQueue.js
var require_PriorityQueue = __commonJS((exports, module) => {
  var Queue = require_Queue();

  class PriorityQueue {
    constructor(size) {
      this._size = Math.max(+size | 0, 1);
      this._slots = [];
      for (let i = 0;i < this._size; i++) {
        this._slots.push(new Queue);
      }
    }
    get length() {
      let _length = 0;
      for (let i = 0, slots = this._slots.length;i < slots; i++) {
        _length += this._slots[i].length;
      }
      return _length;
    }
    enqueue(obj, priority) {
      priority = priority && +priority | 0 || 0;
      if (priority) {
        if (priority < 0 || priority >= this._size) {
          priority = this._size - 1;
        }
      }
      this._slots[priority].push(obj);
    }
    dequeue() {
      for (let i = 0, sl = this._slots.length;i < sl; i += 1) {
        if (this._slots[i].length) {
          return this._slots[i].shift();
        }
      }
      return;
    }
    get head() {
      for (let i = 0, sl = this._slots.length;i < sl; i += 1) {
        if (this._slots[i].length > 0) {
          return this._slots[i].head;
        }
      }
      return;
    }
    get tail() {
      for (let i = this._slots.length - 1;i >= 0; i--) {
        if (this._slots[i].length > 0) {
          return this._slots[i].tail;
        }
      }
      return;
    }
  }
  module.exports = PriorityQueue;
});

// node_modules/generic-pool/lib/utils.js
var require_utils2 = __commonJS((exports) => {
  function noop() {
  }
  exports.reflector = function(promise) {
    return promise.then(noop, noop);
  };
});

// node_modules/generic-pool/lib/Pool.js
var require_Pool = __commonJS((exports, module) => {
  var EventEmitter = import.meta.require("events").EventEmitter;
  var factoryValidator = require_factoryValidator();
  var PoolOptions = require_PoolOptions();
  var ResourceRequest = require_ResourceRequest();
  var ResourceLoan = require_ResourceLoan();
  var PooledResource = require_PooledResource();
  var DefaultEvictor = require_DefaultEvictor();
  var Deque = require_Deque();
  var Deferred = require_Deferred();
  var PriorityQueue = require_PriorityQueue();
  var DequeIterator = require_DequeIterator();
  var reflector = require_utils2().reflector;
  var FACTORY_CREATE_ERROR = "factoryCreateError";
  var FACTORY_DESTROY_ERROR = "factoryDestroyError";

  class Pool extends EventEmitter {
    constructor(Evictor, Deque2, PriorityQueue2, factory, options) {
      super();
      factoryValidator(factory);
      this._config = new PoolOptions(options);
      this._Promise = this._config.Promise;
      this._factory = factory;
      this._draining = false;
      this._started = false;
      this._waitingClientsQueue = new PriorityQueue2(this._config.priorityRange);
      this._factoryCreateOperations = new Set;
      this._factoryDestroyOperations = new Set;
      this._availableObjects = new Deque2;
      this._testOnBorrowResources = new Set;
      this._testOnReturnResources = new Set;
      this._validationOperations = new Set;
      this._allObjects = new Set;
      this._resourceLoans = new Map;
      this._evictionIterator = this._availableObjects.iterator();
      this._evictor = new Evictor;
      this._scheduledEviction = null;
      if (this._config.autostart === true) {
        this.start();
      }
    }
    _destroy(pooledResource) {
      pooledResource.invalidate();
      this._allObjects.delete(pooledResource);
      const destroyPromise = this._factory.destroy(pooledResource.obj);
      const wrappedDestroyPromise = this._config.destroyTimeoutMillis ? this._Promise.resolve(this._applyDestroyTimeout(destroyPromise)) : this._Promise.resolve(destroyPromise);
      this._trackOperation(wrappedDestroyPromise, this._factoryDestroyOperations).catch((reason) => {
        this.emit(FACTORY_DESTROY_ERROR, reason);
      });
      this._ensureMinimum();
    }
    _applyDestroyTimeout(promise) {
      const timeoutPromise = new this._Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("destroy timed out"));
        }, this._config.destroyTimeoutMillis).unref();
      });
      return this._Promise.race([timeoutPromise, promise]);
    }
    _testOnBorrow() {
      if (this._availableObjects.length < 1) {
        return false;
      }
      const pooledResource = this._availableObjects.shift();
      pooledResource.test();
      this._testOnBorrowResources.add(pooledResource);
      const validationPromise = this._factory.validate(pooledResource.obj);
      const wrappedValidationPromise = this._Promise.resolve(validationPromise);
      this._trackOperation(wrappedValidationPromise, this._validationOperations).then((isValid) => {
        this._testOnBorrowResources.delete(pooledResource);
        if (isValid === false) {
          pooledResource.invalidate();
          this._destroy(pooledResource);
          this._dispense();
          return;
        }
        this._dispatchPooledResourceToNextWaitingClient(pooledResource);
      });
      return true;
    }
    _dispatchResource() {
      if (this._availableObjects.length < 1) {
        return false;
      }
      const pooledResource = this._availableObjects.shift();
      this._dispatchPooledResourceToNextWaitingClient(pooledResource);
      return false;
    }
    _dispense() {
      const numWaitingClients = this._waitingClientsQueue.length;
      if (numWaitingClients < 1) {
        return;
      }
      const resourceShortfall = numWaitingClients - this._potentiallyAllocableResourceCount;
      const actualNumberOfResourcesToCreate = Math.min(this.spareResourceCapacity, resourceShortfall);
      for (let i = 0;actualNumberOfResourcesToCreate > i; i++) {
        this._createResource();
      }
      if (this._config.testOnBorrow === true) {
        const desiredNumberOfResourcesToMoveIntoTest = numWaitingClients - this._testOnBorrowResources.size;
        const actualNumberOfResourcesToMoveIntoTest = Math.min(this._availableObjects.length, desiredNumberOfResourcesToMoveIntoTest);
        for (let i = 0;actualNumberOfResourcesToMoveIntoTest > i; i++) {
          this._testOnBorrow();
        }
      }
      if (this._config.testOnBorrow === false) {
        const actualNumberOfResourcesToDispatch = Math.min(this._availableObjects.length, numWaitingClients);
        for (let i = 0;actualNumberOfResourcesToDispatch > i; i++) {
          this._dispatchResource();
        }
      }
    }
    _dispatchPooledResourceToNextWaitingClient(pooledResource) {
      const clientResourceRequest = this._waitingClientsQueue.dequeue();
      if (clientResourceRequest === undefined || clientResourceRequest.state !== Deferred.PENDING) {
        this._addPooledResourceToAvailableObjects(pooledResource);
        return false;
      }
      const loan = new ResourceLoan(pooledResource, this._Promise);
      this._resourceLoans.set(pooledResource.obj, loan);
      pooledResource.allocate();
      clientResourceRequest.resolve(pooledResource.obj);
      return true;
    }
    _trackOperation(operation, set) {
      set.add(operation);
      return operation.then((v) => {
        set.delete(operation);
        return this._Promise.resolve(v);
      }, (e) => {
        set.delete(operation);
        return this._Promise.reject(e);
      });
    }
    _createResource() {
      const factoryPromise = this._factory.create();
      const wrappedFactoryPromise = this._Promise.resolve(factoryPromise).then((resource) => {
        const pooledResource = new PooledResource(resource);
        this._allObjects.add(pooledResource);
        this._addPooledResourceToAvailableObjects(pooledResource);
      });
      this._trackOperation(wrappedFactoryPromise, this._factoryCreateOperations).then(() => {
        this._dispense();
        return null;
      }).catch((reason) => {
        this.emit(FACTORY_CREATE_ERROR, reason);
        this._dispense();
      });
    }
    _ensureMinimum() {
      if (this._draining === true) {
        return;
      }
      const minShortfall = this._config.min - this._count;
      for (let i = 0;i < minShortfall; i++) {
        this._createResource();
      }
    }
    _evict() {
      const testsToRun = Math.min(this._config.numTestsPerEvictionRun, this._availableObjects.length);
      const evictionConfig = {
        softIdleTimeoutMillis: this._config.softIdleTimeoutMillis,
        idleTimeoutMillis: this._config.idleTimeoutMillis,
        min: this._config.min
      };
      for (let testsHaveRun = 0;testsHaveRun < testsToRun; ) {
        const iterationResult = this._evictionIterator.next();
        if (iterationResult.done === true && this._availableObjects.length < 1) {
          this._evictionIterator.reset();
          return;
        }
        if (iterationResult.done === true && this._availableObjects.length > 0) {
          this._evictionIterator.reset();
          continue;
        }
        const resource = iterationResult.value;
        const shouldEvict = this._evictor.evict(evictionConfig, resource, this._availableObjects.length);
        testsHaveRun++;
        if (shouldEvict === true) {
          this._evictionIterator.remove();
          this._destroy(resource);
        }
      }
    }
    _scheduleEvictorRun() {
      if (this._config.evictionRunIntervalMillis > 0) {
        this._scheduledEviction = setTimeout(() => {
          this._evict();
          this._scheduleEvictorRun();
        }, this._config.evictionRunIntervalMillis).unref();
      }
    }
    _descheduleEvictorRun() {
      if (this._scheduledEviction) {
        clearTimeout(this._scheduledEviction);
      }
      this._scheduledEviction = null;
    }
    start() {
      if (this._draining === true) {
        return;
      }
      if (this._started === true) {
        return;
      }
      this._started = true;
      this._scheduleEvictorRun();
      this._ensureMinimum();
    }
    acquire(priority) {
      if (this._started === false && this._config.autostart === false) {
        this.start();
      }
      if (this._draining) {
        return this._Promise.reject(new Error("pool is draining and cannot accept work"));
      }
      if (this.spareResourceCapacity < 1 && this._availableObjects.length < 1 && this._config.maxWaitingClients !== undefined && this._waitingClientsQueue.length >= this._config.maxWaitingClients) {
        return this._Promise.reject(new Error("max waitingClients count exceeded"));
      }
      const resourceRequest = new ResourceRequest(this._config.acquireTimeoutMillis, this._Promise);
      this._waitingClientsQueue.enqueue(resourceRequest, priority);
      this._dispense();
      return resourceRequest.promise;
    }
    use(fn, priority) {
      return this.acquire(priority).then((resource) => {
        return fn(resource).then((result) => {
          this.release(resource);
          return result;
        }, (err) => {
          this.destroy(resource);
          throw err;
        });
      });
    }
    isBorrowedResource(resource) {
      return this._resourceLoans.has(resource);
    }
    release(resource) {
      const loan = this._resourceLoans.get(resource);
      if (loan === undefined) {
        return this._Promise.reject(new Error("Resource not currently part of this pool"));
      }
      this._resourceLoans.delete(resource);
      loan.resolve();
      const pooledResource = loan.pooledResource;
      pooledResource.deallocate();
      this._addPooledResourceToAvailableObjects(pooledResource);
      this._dispense();
      return this._Promise.resolve();
    }
    destroy(resource) {
      const loan = this._resourceLoans.get(resource);
      if (loan === undefined) {
        return this._Promise.reject(new Error("Resource not currently part of this pool"));
      }
      this._resourceLoans.delete(resource);
      loan.resolve();
      const pooledResource = loan.pooledResource;
      pooledResource.deallocate();
      this._destroy(pooledResource);
      this._dispense();
      return this._Promise.resolve();
    }
    _addPooledResourceToAvailableObjects(pooledResource) {
      pooledResource.idle();
      if (this._config.fifo === true) {
        this._availableObjects.push(pooledResource);
      } else {
        this._availableObjects.unshift(pooledResource);
      }
    }
    drain() {
      this._draining = true;
      return this.__allResourceRequestsSettled().then(() => {
        return this.__allResourcesReturned();
      }).then(() => {
        this._descheduleEvictorRun();
      });
    }
    __allResourceRequestsSettled() {
      if (this._waitingClientsQueue.length > 0) {
        return reflector(this._waitingClientsQueue.tail.promise);
      }
      return this._Promise.resolve();
    }
    __allResourcesReturned() {
      const ps = Array.from(this._resourceLoans.values()).map((loan) => loan.promise).map(reflector);
      return this._Promise.all(ps);
    }
    clear() {
      const reflectedCreatePromises = Array.from(this._factoryCreateOperations).map(reflector);
      return this._Promise.all(reflectedCreatePromises).then(() => {
        for (const resource of this._availableObjects) {
          this._destroy(resource);
        }
        const reflectedDestroyPromises = Array.from(this._factoryDestroyOperations).map(reflector);
        return reflector(this._Promise.all(reflectedDestroyPromises));
      });
    }
    ready() {
      return new this._Promise((resolve) => {
        const isReady = () => {
          if (this.available >= this.min) {
            resolve();
          } else {
            setTimeout(isReady, 100);
          }
        };
        isReady();
      });
    }
    get _potentiallyAllocableResourceCount() {
      return this._availableObjects.length + this._testOnBorrowResources.size + this._testOnReturnResources.size + this._factoryCreateOperations.size;
    }
    get _count() {
      return this._allObjects.size + this._factoryCreateOperations.size;
    }
    get spareResourceCapacity() {
      return this._config.max - (this._allObjects.size + this._factoryCreateOperations.size);
    }
    get size() {
      return this._count;
    }
    get available() {
      return this._availableObjects.length;
    }
    get borrowed() {
      return this._resourceLoans.size;
    }
    get pending() {
      return this._waitingClientsQueue.length;
    }
    get max() {
      return this._config.max;
    }
    get min() {
      return this._config.min;
    }
  }
  module.exports = Pool;
});

// node_modules/generic-pool/index.js
var require_generic_pool = __commonJS((exports, module) => {
  var Pool = require_Pool();
  var Deque = require_Deque();
  var PriorityQueue = require_PriorityQueue();
  var DefaultEvictor = require_DefaultEvictor();
  module.exports = {
    Pool,
    Deque,
    PriorityQueue,
    DefaultEvictor,
    createPool: function(factory, config2) {
      return new Pool(DefaultEvictor, Deque, PriorityQueue, factory, config2);
    }
  };
});

// node_modules/@redis/client/dist/package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "@redis/client",
    version: "1.5.17",
    license: "MIT",
    main: "./dist/index.js",
    types: "./dist/index.d.ts",
    files: [
      "dist/"
    ],
    scripts: {
      test: "nyc -r text-summary -r lcov mocha -r source-map-support/register -r ts-node/register './lib/**/*.spec.ts'",
      build: "tsc",
      lint: "eslint ./*.ts ./lib/**/*.ts",
      documentation: "typedoc"
    },
    dependencies: {
      "cluster-key-slot": "1.1.2",
      "generic-pool": "3.9.0",
      yallist: "4.0.0"
    },
    devDependencies: {
      "@istanbuljs/nyc-config-typescript": "^1.0.2",
      "@redis/test-utils": "*",
      "@types/node": "^20.6.2",
      "@types/sinon": "^10.0.16",
      "@types/yallist": "^4.0.1",
      "@typescript-eslint/eslint-plugin": "^6.7.2",
      "@typescript-eslint/parser": "^6.7.2",
      eslint: "^8.49.0",
      nyc: "^15.1.0",
      "release-it": "^16.1.5",
      sinon: "^16.0.0",
      "source-map-support": "^0.5.21",
      "ts-node": "^10.9.1",
      typedoc: "^0.25.1",
      typescript: "^5.2.2"
    },
    engines: {
      node: ">=14"
    },
    repository: {
      type: "git",
      url: "git://github.com/redis/node-redis.git"
    },
    bugs: {
      url: "https://github.com/redis/node-redis/issues"
    },
    homepage: "https://github.com/redis/node-redis/tree/master/packages/client",
    keywords: [
      "redis"
    ]
  };
});

// node_modules/@redis/client/dist/lib/client/index.js
var require_client = __commonJS((exports) => {
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _RedisClient_instances;
  var _a;
  var _RedisClient_options;
  var _RedisClient_socket;
  var _RedisClient_queue;
  var _RedisClient_isolationPool;
  var _RedisClient_v4;
  var _RedisClient_selectedDB;
  var _RedisClient_initiateOptions;
  var _RedisClient_initiateQueue;
  var _RedisClient_initiateSocket;
  var _RedisClient_initiateIsolationPool;
  var _RedisClient_legacyMode;
  var _RedisClient_legacySendCommand;
  var _RedisClient_defineLegacyCommand;
  var _RedisClient_pingTimer;
  var _RedisClient_setPingTimer;
  var _RedisClient_sendCommand;
  var _RedisClient_pubSubCommand;
  var _RedisClient_tick;
  var _RedisClient_addMultiCommands;
  var _RedisClient_destroyIsolationPool;
  Object.defineProperty(exports, "__esModule", { value: true });
  var commands_1 = require_commands2();
  var socket_1 = require_socket();
  var commands_queue_1 = require_commands_queue();
  var multi_command_1 = require_multi_command2();
  var events_1 = import.meta.require("events");
  var command_options_1 = require_command_options();
  var commander_1 = require_commander();
  var generic_pool_1 = require_generic_pool();
  var errors_1 = require_errors();
  var url_1 = import.meta.require("url");
  var pub_sub_1 = require_pub_sub();
  var package_json_1 = require_package();

  class RedisClient extends events_1.EventEmitter {
    static commandOptions(options) {
      return (0, command_options_1.commandOptions)(options);
    }
    static extend(extensions) {
      const Client = (0, commander_1.attachExtensions)({
        BaseClass: _a,
        modulesExecutor: _a.prototype.commandsExecutor,
        modules: extensions?.modules,
        functionsExecutor: _a.prototype.functionsExecuter,
        functions: extensions?.functions,
        scriptsExecutor: _a.prototype.scriptsExecuter,
        scripts: extensions?.scripts
      });
      if (Client !== _a) {
        Client.prototype.Multi = multi_command_1.default.extend(extensions);
      }
      return Client;
    }
    static create(options) {
      return new (_a.extend(options))(options);
    }
    static parseURL(url7) {
      const { hostname, port, protocol, username, password, pathname } = new url_1.URL(url7), parsed = {
        socket: {
          host: hostname
        }
      };
      if (protocol === "rediss:") {
        parsed.socket.tls = true;
      } else if (protocol !== "redis:") {
        throw new TypeError("Invalid protocol");
      }
      if (port) {
        parsed.socket.port = Number(port);
      }
      if (username) {
        parsed.username = decodeURIComponent(username);
      }
      if (password) {
        parsed.password = decodeURIComponent(password);
      }
      if (pathname.length > 1) {
        const database = Number(pathname.substring(1));
        if (isNaN(database)) {
          throw new TypeError("Invalid pathname");
        }
        parsed.database = database;
      }
      return parsed;
    }
    get options() {
      return __classPrivateFieldGet(this, _RedisClient_options, "f");
    }
    get isOpen() {
      return __classPrivateFieldGet(this, _RedisClient_socket, "f").isOpen;
    }
    get isReady() {
      return __classPrivateFieldGet(this, _RedisClient_socket, "f").isReady;
    }
    get isPubSubActive() {
      return __classPrivateFieldGet(this, _RedisClient_queue, "f").isPubSubActive;
    }
    get v4() {
      if (!__classPrivateFieldGet(this, _RedisClient_options, "f")?.legacyMode) {
        throw new Error('the client is not in "legacy mode"');
      }
      return __classPrivateFieldGet(this, _RedisClient_v4, "f");
    }
    constructor(options) {
      super();
      _RedisClient_instances.add(this);
      Object.defineProperty(this, "commandOptions", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: _a.commandOptions
      });
      _RedisClient_options.set(this, undefined);
      _RedisClient_socket.set(this, undefined);
      _RedisClient_queue.set(this, undefined);
      _RedisClient_isolationPool.set(this, undefined);
      _RedisClient_v4.set(this, {});
      _RedisClient_selectedDB.set(this, 0);
      _RedisClient_pingTimer.set(this, undefined);
      Object.defineProperty(this, "select", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SELECT
      });
      Object.defineProperty(this, "subscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SUBSCRIBE
      });
      Object.defineProperty(this, "unsubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.UNSUBSCRIBE
      });
      Object.defineProperty(this, "pSubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.PSUBSCRIBE
      });
      Object.defineProperty(this, "pUnsubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.PUNSUBSCRIBE
      });
      Object.defineProperty(this, "sSubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SSUBSCRIBE
      });
      Object.defineProperty(this, "sUnsubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SUNSUBSCRIBE
      });
      Object.defineProperty(this, "quit", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.QUIT
      });
      Object.defineProperty(this, "multi", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.MULTI
      });
      __classPrivateFieldSet(this, _RedisClient_options, __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_initiateOptions).call(this, options), "f");
      __classPrivateFieldSet(this, _RedisClient_queue, __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_initiateQueue).call(this), "f");
      __classPrivateFieldSet(this, _RedisClient_socket, __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_initiateSocket).call(this), "f");
      __classPrivateFieldSet(this, _RedisClient_isolationPool, __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_initiateIsolationPool).call(this), "f");
      __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_legacyMode).call(this);
    }
    duplicate(overrides) {
      return new (Object.getPrototypeOf(this)).constructor({
        ...__classPrivateFieldGet(this, _RedisClient_options, "f"),
        ...overrides
      });
    }
    async connect() {
      __classPrivateFieldSet(this, _RedisClient_isolationPool, __classPrivateFieldGet(this, _RedisClient_isolationPool, "f") ?? __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_initiateIsolationPool).call(this), "f");
      await __classPrivateFieldGet(this, _RedisClient_socket, "f").connect();
      return this;
    }
    async commandsExecutor(command, args) {
      const { args: redisArgs, options } = (0, commander_1.transformCommandArguments)(command, args);
      return (0, commander_1.transformCommandReply)(command, await __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, redisArgs, options), redisArgs.preserve);
    }
    sendCommand(args, options) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, args, options);
    }
    async functionsExecuter(fn, args, name) {
      const { args: redisArgs, options } = (0, commander_1.transformCommandArguments)(fn, args);
      return (0, commander_1.transformCommandReply)(fn, await this.executeFunction(name, fn, redisArgs, options), redisArgs.preserve);
    }
    executeFunction(name, fn, args, options) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, (0, commander_1.fCallArguments)(name, fn, args), options);
    }
    async scriptsExecuter(script, args) {
      const { args: redisArgs, options } = (0, commander_1.transformCommandArguments)(script, args);
      return (0, commander_1.transformCommandReply)(script, await this.executeScript(script, redisArgs, options), redisArgs.preserve);
    }
    async executeScript(script, args, options) {
      const redisArgs = ["EVALSHA", script.SHA1];
      if (script.NUMBER_OF_KEYS !== undefined) {
        redisArgs.push(script.NUMBER_OF_KEYS.toString());
      }
      redisArgs.push(...args);
      try {
        return await __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, redisArgs, options);
      } catch (err) {
        if (!err?.message?.startsWith?.("NOSCRIPT")) {
          throw err;
        }
        redisArgs[0] = "EVAL";
        redisArgs[1] = script.SCRIPT;
        return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, redisArgs, options);
      }
    }
    async SELECT(options, db) {
      if (!(0, command_options_1.isCommandOptions)(options)) {
        db = options;
        options = null;
      }
      await __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, ["SELECT", db.toString()], options);
      __classPrivateFieldSet(this, _RedisClient_selectedDB, db, "f");
    }
    SUBSCRIBE(channels, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").subscribe(pub_sub_1.PubSubType.CHANNELS, channels, listener, bufferMode));
    }
    UNSUBSCRIBE(channels, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").unsubscribe(pub_sub_1.PubSubType.CHANNELS, channels, listener, bufferMode));
    }
    PSUBSCRIBE(patterns, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").subscribe(pub_sub_1.PubSubType.PATTERNS, patterns, listener, bufferMode));
    }
    PUNSUBSCRIBE(patterns, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").unsubscribe(pub_sub_1.PubSubType.PATTERNS, patterns, listener, bufferMode));
    }
    SSUBSCRIBE(channels, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").subscribe(pub_sub_1.PubSubType.SHARDED, channels, listener, bufferMode));
    }
    SUNSUBSCRIBE(channels, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").unsubscribe(pub_sub_1.PubSubType.SHARDED, channels, listener, bufferMode));
    }
    getPubSubListeners(type) {
      return __classPrivateFieldGet(this, _RedisClient_queue, "f").getPubSubListeners(type);
    }
    extendPubSubChannelListeners(type, channel, listeners) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").extendPubSubChannelListeners(type, channel, listeners));
    }
    extendPubSubListeners(type, listeners) {
      return __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_pubSubCommand).call(this, __classPrivateFieldGet(this, _RedisClient_queue, "f").extendPubSubListeners(type, listeners));
    }
    QUIT() {
      return __classPrivateFieldGet(this, _RedisClient_socket, "f").quit(async () => {
        if (__classPrivateFieldGet(this, _RedisClient_pingTimer, "f"))
          clearTimeout(__classPrivateFieldGet(this, _RedisClient_pingTimer, "f"));
        const quitPromise = __classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(["QUIT"]);
        __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_tick).call(this);
        const [reply] = await Promise.all([
          quitPromise,
          __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_destroyIsolationPool).call(this)
        ]);
        return reply;
      });
    }
    executeIsolated(fn) {
      if (!__classPrivateFieldGet(this, _RedisClient_isolationPool, "f"))
        return Promise.reject(new errors_1.ClientClosedError);
      return __classPrivateFieldGet(this, _RedisClient_isolationPool, "f").use(fn);
    }
    MULTI() {
      return new this.Multi(this.multiExecutor.bind(this), __classPrivateFieldGet(this, _RedisClient_options, "f")?.legacyMode);
    }
    async multiExecutor(commands, selectedDB, chainId) {
      if (!__classPrivateFieldGet(this, _RedisClient_socket, "f").isOpen) {
        return Promise.reject(new errors_1.ClientClosedError);
      }
      const promise = chainId ? Promise.all([
        __classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(["MULTI"], { chainId }),
        __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_addMultiCommands).call(this, commands, chainId),
        __classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(["EXEC"], { chainId })
      ]) : __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_addMultiCommands).call(this, commands);
      __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_tick).call(this);
      const results = await promise;
      if (selectedDB !== undefined) {
        __classPrivateFieldSet(this, _RedisClient_selectedDB, selectedDB, "f");
      }
      return results;
    }
    async* scanIterator(options) {
      let cursor = 0;
      do {
        const reply = await this.scan(cursor, options);
        cursor = reply.cursor;
        for (const key of reply.keys) {
          yield key;
        }
      } while (cursor !== 0);
    }
    async* hScanIterator(key, options) {
      let cursor = 0;
      do {
        const reply = await this.hScan(key, cursor, options);
        cursor = reply.cursor;
        for (const tuple of reply.tuples) {
          yield tuple;
        }
      } while (cursor !== 0);
    }
    async* hScanNoValuesIterator(key, options) {
      let cursor = 0;
      do {
        const reply = await this.hScanNoValues(key, cursor, options);
        cursor = reply.cursor;
        for (const k of reply.keys) {
          yield k;
        }
      } while (cursor !== 0);
    }
    async* sScanIterator(key, options) {
      let cursor = 0;
      do {
        const reply = await this.sScan(key, cursor, options);
        cursor = reply.cursor;
        for (const member of reply.members) {
          yield member;
        }
      } while (cursor !== 0);
    }
    async* zScanIterator(key, options) {
      let cursor = 0;
      do {
        const reply = await this.zScan(key, cursor, options);
        cursor = reply.cursor;
        for (const member of reply.members) {
          yield member;
        }
      } while (cursor !== 0);
    }
    async disconnect() {
      if (__classPrivateFieldGet(this, _RedisClient_pingTimer, "f"))
        clearTimeout(__classPrivateFieldGet(this, _RedisClient_pingTimer, "f"));
      __classPrivateFieldGet(this, _RedisClient_queue, "f").flushAll(new errors_1.DisconnectsClientError);
      __classPrivateFieldGet(this, _RedisClient_socket, "f").disconnect();
      await __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_destroyIsolationPool).call(this);
    }
    ref() {
      __classPrivateFieldGet(this, _RedisClient_socket, "f").ref();
    }
    unref() {
      __classPrivateFieldGet(this, _RedisClient_socket, "f").unref();
    }
  }
  _a = RedisClient, _RedisClient_options = new WeakMap, _RedisClient_socket = new WeakMap, _RedisClient_queue = new WeakMap, _RedisClient_isolationPool = new WeakMap, _RedisClient_v4 = new WeakMap, _RedisClient_selectedDB = new WeakMap, _RedisClient_pingTimer = new WeakMap, _RedisClient_instances = new WeakSet, _RedisClient_initiateOptions = function _RedisClient_initiateOptions(options) {
    if (options?.url) {
      const parsed = _a.parseURL(options.url);
      if (options.socket) {
        parsed.socket = Object.assign(options.socket, parsed.socket);
      }
      Object.assign(options, parsed);
    }
    if (options?.database) {
      __classPrivateFieldSet(this, _RedisClient_selectedDB, options.database, "f");
    }
    return options;
  }, _RedisClient_initiateQueue = function _RedisClient_initiateQueue() {
    return new commands_queue_1.default(__classPrivateFieldGet(this, _RedisClient_options, "f")?.commandsQueueMaxLength, (channel, listeners) => this.emit("sharded-channel-moved", channel, listeners));
  }, _RedisClient_initiateSocket = function _RedisClient_initiateSocket() {
    const socketInitiator = async () => {
      const promises = [];
      if (__classPrivateFieldGet(this, _RedisClient_selectedDB, "f") !== 0) {
        promises.push(__classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(["SELECT", __classPrivateFieldGet(this, _RedisClient_selectedDB, "f").toString()], { asap: true }));
      }
      if (__classPrivateFieldGet(this, _RedisClient_options, "f")?.readonly) {
        promises.push(__classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(commands_1.default.READONLY.transformArguments(), { asap: true }));
      }
      if (!__classPrivateFieldGet(this, _RedisClient_options, "f")?.disableClientInfo) {
        promises.push(__classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(["CLIENT", "SETINFO", "LIB-VER", package_json_1.version], { asap: true }).catch((err) => {
          if (!(err instanceof errors_1.ErrorReply)) {
            throw err;
          }
        }));
        promises.push(__classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand([
          "CLIENT",
          "SETINFO",
          "LIB-NAME",
          __classPrivateFieldGet(this, _RedisClient_options, "f")?.clientInfoTag ? `node-redis(${__classPrivateFieldGet(this, _RedisClient_options, "f").clientInfoTag})` : "node-redis"
        ], { asap: true }).catch((err) => {
          if (!(err instanceof errors_1.ErrorReply)) {
            throw err;
          }
        }));
      }
      if (__classPrivateFieldGet(this, _RedisClient_options, "f")?.name) {
        promises.push(__classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(commands_1.default.CLIENT_SETNAME.transformArguments(__classPrivateFieldGet(this, _RedisClient_options, "f").name), { asap: true }));
      }
      if (__classPrivateFieldGet(this, _RedisClient_options, "f")?.username || __classPrivateFieldGet(this, _RedisClient_options, "f")?.password) {
        promises.push(__classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(commands_1.default.AUTH.transformArguments({
          username: __classPrivateFieldGet(this, _RedisClient_options, "f").username,
          password: __classPrivateFieldGet(this, _RedisClient_options, "f").password ?? ""
        }), { asap: true }));
      }
      const resubscribePromise = __classPrivateFieldGet(this, _RedisClient_queue, "f").resubscribe();
      if (resubscribePromise) {
        promises.push(resubscribePromise);
      }
      if (promises.length) {
        __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_tick).call(this, true);
        await Promise.all(promises);
      }
    };
    return new socket_1.default(socketInitiator, __classPrivateFieldGet(this, _RedisClient_options, "f")?.socket).on("data", (chunk) => __classPrivateFieldGet(this, _RedisClient_queue, "f").onReplyChunk(chunk)).on("error", (err) => {
      this.emit("error", err);
      if (__classPrivateFieldGet(this, _RedisClient_socket, "f").isOpen && !__classPrivateFieldGet(this, _RedisClient_options, "f")?.disableOfflineQueue) {
        __classPrivateFieldGet(this, _RedisClient_queue, "f").flushWaitingForReply(err);
      } else {
        __classPrivateFieldGet(this, _RedisClient_queue, "f").flushAll(err);
      }
    }).on("connect", () => {
      this.emit("connect");
    }).on("ready", () => {
      this.emit("ready");
      __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_setPingTimer).call(this);
      __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_tick).call(this);
    }).on("reconnecting", () => this.emit("reconnecting")).on("drain", () => __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_tick).call(this)).on("end", () => this.emit("end"));
  }, _RedisClient_initiateIsolationPool = function _RedisClient_initiateIsolationPool() {
    return (0, generic_pool_1.createPool)({
      create: async () => {
        const duplicate = this.duplicate({
          isolationPoolOptions: undefined
        }).on("error", (err) => this.emit("error", err));
        await duplicate.connect();
        return duplicate;
      },
      destroy: (client) => client.disconnect()
    }, __classPrivateFieldGet(this, _RedisClient_options, "f")?.isolationPoolOptions);
  }, _RedisClient_legacyMode = function _RedisClient_legacyMode() {
    var _b, _c;
    if (!__classPrivateFieldGet(this, _RedisClient_options, "f")?.legacyMode)
      return;
    __classPrivateFieldGet(this, _RedisClient_v4, "f").sendCommand = __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).bind(this);
    this.sendCommand = (...args) => {
      const result = __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_legacySendCommand).call(this, ...args);
      if (result) {
        result.promise.then((reply) => result.callback(null, reply)).catch((err) => result.callback(err));
      }
    };
    for (const [name, command] of Object.entries(commands_1.default)) {
      __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, name, command);
      (_b = this)[_c = name.toLowerCase()] ?? (_b[_c] = this[name]);
    }
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "SELECT");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "select");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "SUBSCRIBE");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "subscribe");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "PSUBSCRIBE");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "pSubscribe");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "UNSUBSCRIBE");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "unsubscribe");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "PUNSUBSCRIBE");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "pUnsubscribe");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "QUIT");
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_defineLegacyCommand).call(this, "quit");
  }, _RedisClient_legacySendCommand = function _RedisClient_legacySendCommand(...args) {
    const callback = typeof args[args.length - 1] === "function" ? args.pop() : undefined;
    const promise = __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, (0, commander_1.transformLegacyCommandArguments)(args));
    if (callback)
      return {
        promise,
        callback
      };
    promise.catch((err) => this.emit("error", err));
  }, _RedisClient_defineLegacyCommand = function _RedisClient_defineLegacyCommand(name, command) {
    __classPrivateFieldGet(this, _RedisClient_v4, "f")[name] = this[name].bind(this);
    this[name] = command && command.TRANSFORM_LEGACY_REPLY && command.transformReply ? (...args) => {
      const result = __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_legacySendCommand).call(this, name, ...args);
      if (result) {
        result.promise.then((reply) => result.callback(null, command.transformReply(reply))).catch((err) => result.callback(err));
      }
    } : (...args) => this.sendCommand(name, ...args);
  }, _RedisClient_setPingTimer = function _RedisClient_setPingTimer() {
    if (!__classPrivateFieldGet(this, _RedisClient_options, "f")?.pingInterval || !__classPrivateFieldGet(this, _RedisClient_socket, "f").isReady)
      return;
    clearTimeout(__classPrivateFieldGet(this, _RedisClient_pingTimer, "f"));
    __classPrivateFieldSet(this, _RedisClient_pingTimer, setTimeout(() => {
      if (!__classPrivateFieldGet(this, _RedisClient_socket, "f").isReady)
        return;
      __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_sendCommand).call(this, ["PING"]).then((reply) => this.emit("ping-interval", reply)).catch((err) => this.emit("error", err)).finally(() => __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_setPingTimer).call(this));
    }, __classPrivateFieldGet(this, _RedisClient_options, "f").pingInterval), "f");
  }, _RedisClient_sendCommand = function _RedisClient_sendCommand(args, options) {
    if (!__classPrivateFieldGet(this, _RedisClient_socket, "f").isOpen) {
      return Promise.reject(new errors_1.ClientClosedError);
    } else if (options?.isolated) {
      return this.executeIsolated((isolatedClient) => isolatedClient.sendCommand(args, {
        ...options,
        isolated: false
      }));
    } else if (!__classPrivateFieldGet(this, _RedisClient_socket, "f").isReady && __classPrivateFieldGet(this, _RedisClient_options, "f")?.disableOfflineQueue) {
      return Promise.reject(new errors_1.ClientOfflineError);
    }
    const promise = __classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(args, options);
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_tick).call(this);
    return promise;
  }, _RedisClient_pubSubCommand = function _RedisClient_pubSubCommand(promise) {
    if (promise === undefined)
      return Promise.resolve();
    __classPrivateFieldGet(this, _RedisClient_instances, "m", _RedisClient_tick).call(this);
    return promise;
  }, _RedisClient_tick = function _RedisClient_tick(force = false) {
    if (__classPrivateFieldGet(this, _RedisClient_socket, "f").writableNeedDrain || !force && !__classPrivateFieldGet(this, _RedisClient_socket, "f").isReady) {
      return;
    }
    __classPrivateFieldGet(this, _RedisClient_socket, "f").cork();
    while (!__classPrivateFieldGet(this, _RedisClient_socket, "f").writableNeedDrain) {
      const args = __classPrivateFieldGet(this, _RedisClient_queue, "f").getCommandToSend();
      if (args === undefined)
        break;
      __classPrivateFieldGet(this, _RedisClient_socket, "f").writeCommand(args);
    }
  }, _RedisClient_addMultiCommands = function _RedisClient_addMultiCommands(commands, chainId) {
    return Promise.all(commands.map(({ args }) => __classPrivateFieldGet(this, _RedisClient_queue, "f").addCommand(args, { chainId })));
  }, _RedisClient_destroyIsolationPool = async function _RedisClient_destroyIsolationPool() {
    await __classPrivateFieldGet(this, _RedisClient_isolationPool, "f").drain();
    await __classPrivateFieldGet(this, _RedisClient_isolationPool, "f").clear();
    __classPrivateFieldSet(this, _RedisClient_isolationPool, undefined, "f");
  };
  exports.default = RedisClient;
  (0, commander_1.attachCommands)({
    BaseClass: RedisClient,
    commands: commands_1.default,
    executor: RedisClient.prototype.commandsExecutor
  });
  RedisClient.prototype.Multi = multi_command_1.default;
});

// node_modules/cluster-key-slot/lib/index.js
var require_lib = __commonJS((exports, module) => {
  var lookup = [
    0,
    4129,
    8258,
    12387,
    16516,
    20645,
    24774,
    28903,
    33032,
    37161,
    41290,
    45419,
    49548,
    53677,
    57806,
    61935,
    4657,
    528,
    12915,
    8786,
    21173,
    17044,
    29431,
    25302,
    37689,
    33560,
    45947,
    41818,
    54205,
    50076,
    62463,
    58334,
    9314,
    13379,
    1056,
    5121,
    25830,
    29895,
    17572,
    21637,
    42346,
    46411,
    34088,
    38153,
    58862,
    62927,
    50604,
    54669,
    13907,
    9842,
    5649,
    1584,
    30423,
    26358,
    22165,
    18100,
    46939,
    42874,
    38681,
    34616,
    63455,
    59390,
    55197,
    51132,
    18628,
    22757,
    26758,
    30887,
    2112,
    6241,
    10242,
    14371,
    51660,
    55789,
    59790,
    63919,
    35144,
    39273,
    43274,
    47403,
    23285,
    19156,
    31415,
    27286,
    6769,
    2640,
    14899,
    10770,
    56317,
    52188,
    64447,
    60318,
    39801,
    35672,
    47931,
    43802,
    27814,
    31879,
    19684,
    23749,
    11298,
    15363,
    3168,
    7233,
    60846,
    64911,
    52716,
    56781,
    44330,
    48395,
    36200,
    40265,
    32407,
    28342,
    24277,
    20212,
    15891,
    11826,
    7761,
    3696,
    65439,
    61374,
    57309,
    53244,
    48923,
    44858,
    40793,
    36728,
    37256,
    33193,
    45514,
    41451,
    53516,
    49453,
    61774,
    57711,
    4224,
    161,
    12482,
    8419,
    20484,
    16421,
    28742,
    24679,
    33721,
    37784,
    41979,
    46042,
    49981,
    54044,
    58239,
    62302,
    689,
    4752,
    8947,
    13010,
    16949,
    21012,
    25207,
    29270,
    46570,
    42443,
    38312,
    34185,
    62830,
    58703,
    54572,
    50445,
    13538,
    9411,
    5280,
    1153,
    29798,
    25671,
    21540,
    17413,
    42971,
    47098,
    34713,
    38840,
    59231,
    63358,
    50973,
    55100,
    9939,
    14066,
    1681,
    5808,
    26199,
    30326,
    17941,
    22068,
    55628,
    51565,
    63758,
    59695,
    39368,
    35305,
    47498,
    43435,
    22596,
    18533,
    30726,
    26663,
    6336,
    2273,
    14466,
    10403,
    52093,
    56156,
    60223,
    64286,
    35833,
    39896,
    43963,
    48026,
    19061,
    23124,
    27191,
    31254,
    2801,
    6864,
    10931,
    14994,
    64814,
    60687,
    56684,
    52557,
    48554,
    44427,
    40424,
    36297,
    31782,
    27655,
    23652,
    19525,
    15522,
    11395,
    7392,
    3265,
    61215,
    65342,
    53085,
    57212,
    44955,
    49082,
    36825,
    40952,
    28183,
    32310,
    20053,
    24180,
    11923,
    16050,
    3793,
    7920
  ];
  var toUTF8Array = function toUTF8Array(str) {
    var char;
    var i = 0;
    var p = 0;
    var utf8 = [];
    var len = str.length;
    for (;i < len; i++) {
      char = str.charCodeAt(i);
      if (char < 128) {
        utf8[p++] = char;
      } else if (char < 2048) {
        utf8[p++] = char >> 6 | 192;
        utf8[p++] = char & 63 | 128;
      } else if ((char & 64512) === 55296 && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === 56320) {
        char = 65536 + ((char & 1023) << 10) + (str.charCodeAt(++i) & 1023);
        utf8[p++] = char >> 18 | 240;
        utf8[p++] = char >> 12 & 63 | 128;
        utf8[p++] = char >> 6 & 63 | 128;
        utf8[p++] = char & 63 | 128;
      } else {
        utf8[p++] = char >> 12 | 224;
        utf8[p++] = char >> 6 & 63 | 128;
        utf8[p++] = char & 63 | 128;
      }
    }
    return utf8;
  };
  var generate = module.exports = function generate(str) {
    var char;
    var i = 0;
    var start = -1;
    var result = 0;
    var resultHash = 0;
    var utf8 = typeof str === "string" ? toUTF8Array(str) : str;
    var len = utf8.length;
    while (i < len) {
      char = utf8[i++];
      if (start === -1) {
        if (char === 123) {
          start = i;
        }
      } else if (char !== 125) {
        resultHash = lookup[(char ^ resultHash >> 8) & 255] ^ resultHash << 8;
      } else if (i - 1 !== start) {
        return resultHash & 16383;
      }
      result = lookup[(char ^ result >> 8) & 255] ^ result << 8;
    }
    return result & 16383;
  };
  module.exports.generateMulti = function generateMulti(keys) {
    var i = 1;
    var len = keys.length;
    var base = generate(keys[0]);
    while (i < len) {
      if (generate(keys[i++]) !== base)
        return -1;
    }
    return base;
  };
});

// node_modules/@redis/client/dist/lib/cluster/cluster-slots.js
var require_cluster_slots = __commonJS((exports) => {
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _RedisClusterSlots_instances;
  var _a;
  var _RedisClusterSlots_SLOTS;
  var _RedisClusterSlots_options;
  var _RedisClusterSlots_Client;
  var _RedisClusterSlots_emit;
  var _RedisClusterSlots_isOpen;
  var _RedisClusterSlots_discoverWithRootNodes;
  var _RedisClusterSlots_resetSlots;
  var _RedisClusterSlots_discover;
  var _RedisClusterSlots_getShards;
  var _RedisClusterSlots_getNodeAddress;
  var _RedisClusterSlots_clientOptionsDefaults;
  var _RedisClusterSlots_initiateSlotNode;
  var _RedisClusterSlots_createClient;
  var _RedisClusterSlots_createNodeClient;
  var _RedisClusterSlots_runningRediscoverPromise;
  var _RedisClusterSlots_rediscover;
  var _RedisClusterSlots_destroy;
  var _RedisClusterSlots_execOnNodeClient;
  var _RedisClusterSlots_iterateAllNodes;
  var _RedisClusterSlots_randomNodeIterator;
  var _RedisClusterSlots_slotNodesIterator;
  var _RedisClusterSlots_initiatePubSubClient;
  var _RedisClusterSlots_initiateShardedPubSubClient;
  Object.defineProperty(exports, "__esModule", { value: true });
  var client_1 = require_client();
  var errors_1 = require_errors();
  var util_1 = import.meta.require("util");
  var pub_sub_1 = require_pub_sub();
  var calculateSlot = require_lib();

  class RedisClusterSlots {
    get isOpen() {
      return __classPrivateFieldGet(this, _RedisClusterSlots_isOpen, "f");
    }
    constructor(options, emit) {
      _RedisClusterSlots_instances.add(this);
      _RedisClusterSlots_options.set(this, undefined);
      _RedisClusterSlots_Client.set(this, undefined);
      _RedisClusterSlots_emit.set(this, undefined);
      Object.defineProperty(this, "slots", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Array(__classPrivateFieldGet(_a, _a, "f", _RedisClusterSlots_SLOTS))
      });
      Object.defineProperty(this, "shards", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Array
      });
      Object.defineProperty(this, "masters", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Array
      });
      Object.defineProperty(this, "replicas", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Array
      });
      Object.defineProperty(this, "nodeByAddress", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: new Map
      });
      Object.defineProperty(this, "pubSubNode", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: undefined
      });
      _RedisClusterSlots_isOpen.set(this, false);
      _RedisClusterSlots_runningRediscoverPromise.set(this, undefined);
      _RedisClusterSlots_randomNodeIterator.set(this, undefined);
      __classPrivateFieldSet(this, _RedisClusterSlots_options, options, "f");
      __classPrivateFieldSet(this, _RedisClusterSlots_Client, client_1.default.extend(options), "f");
      __classPrivateFieldSet(this, _RedisClusterSlots_emit, emit, "f");
    }
    async connect() {
      if (__classPrivateFieldGet(this, _RedisClusterSlots_isOpen, "f")) {
        throw new Error("Cluster already open");
      }
      __classPrivateFieldSet(this, _RedisClusterSlots_isOpen, true, "f");
      try {
        await __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_discoverWithRootNodes).call(this);
      } catch (err) {
        __classPrivateFieldSet(this, _RedisClusterSlots_isOpen, false, "f");
        throw err;
      }
    }
    nodeClient(node4) {
      return node4.client ?? __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_createNodeClient).call(this, node4);
    }
    async rediscover(startWith) {
      __classPrivateFieldSet(this, _RedisClusterSlots_runningRediscoverPromise, __classPrivateFieldGet(this, _RedisClusterSlots_runningRediscoverPromise, "f") ?? __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_rediscover).call(this, startWith).finally(() => __classPrivateFieldSet(this, _RedisClusterSlots_runningRediscoverPromise, undefined, "f")), "f");
      return __classPrivateFieldGet(this, _RedisClusterSlots_runningRediscoverPromise, "f");
    }
    quit() {
      return __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_destroy).call(this, (client) => client.quit());
    }
    disconnect() {
      return __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_destroy).call(this, (client) => client.disconnect());
    }
    getClient(firstKey, isReadonly) {
      if (!firstKey) {
        return this.nodeClient(this.getRandomNode());
      }
      const slotNumber = calculateSlot(firstKey);
      if (!isReadonly) {
        return this.nodeClient(this.slots[slotNumber].master);
      }
      return this.nodeClient(this.getSlotRandomNode(slotNumber));
    }
    getRandomNode() {
      __classPrivateFieldSet(this, _RedisClusterSlots_randomNodeIterator, __classPrivateFieldGet(this, _RedisClusterSlots_randomNodeIterator, "f") ?? __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_iterateAllNodes).call(this), "f");
      return __classPrivateFieldGet(this, _RedisClusterSlots_randomNodeIterator, "f").next().value;
    }
    getSlotRandomNode(slotNumber) {
      const slot = this.slots[slotNumber];
      if (!slot.replicas?.length) {
        return slot.master;
      }
      slot.nodesIterator ?? (slot.nodesIterator = __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_slotNodesIterator).call(this, slot));
      return slot.nodesIterator.next().value;
    }
    getMasterByAddress(address) {
      const master = this.nodeByAddress.get(address);
      if (!master)
        return;
      return this.nodeClient(master);
    }
    getPubSubClient() {
      return this.pubSubNode ? this.pubSubNode.client : __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_initiatePubSubClient).call(this);
    }
    async executeUnsubscribeCommand(unsubscribe) {
      const client = await this.getPubSubClient();
      await unsubscribe(client);
      if (!client.isPubSubActive && client.isOpen) {
        await client.disconnect();
        this.pubSubNode = undefined;
      }
    }
    getShardedPubSubClient(channel) {
      const { master } = this.slots[calculateSlot(channel)];
      return master.pubSubClient ?? __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_initiateShardedPubSubClient).call(this, master);
    }
    async executeShardedUnsubscribeCommand(channel, unsubscribe) {
      const { master } = this.slots[calculateSlot(channel)];
      if (!master.pubSubClient)
        return Promise.resolve();
      const client = await master.pubSubClient;
      await unsubscribe(client);
      if (!client.isPubSubActive && client.isOpen) {
        await client.disconnect();
        master.pubSubClient = undefined;
      }
    }
  }
  _a = RedisClusterSlots, _RedisClusterSlots_options = new WeakMap, _RedisClusterSlots_Client = new WeakMap, _RedisClusterSlots_emit = new WeakMap, _RedisClusterSlots_isOpen = new WeakMap, _RedisClusterSlots_runningRediscoverPromise = new WeakMap, _RedisClusterSlots_randomNodeIterator = new WeakMap, _RedisClusterSlots_instances = new WeakSet, _RedisClusterSlots_discoverWithRootNodes = async function _RedisClusterSlots_discoverWithRootNodes() {
    let start = Math.floor(Math.random() * __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").rootNodes.length);
    for (let i = start;i < __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").rootNodes.length; i++) {
      if (await __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_discover).call(this, __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").rootNodes[i]))
        return;
    }
    for (let i = 0;i < start; i++) {
      if (await __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_discover).call(this, __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").rootNodes[i]))
        return;
    }
    throw new errors_1.RootNodesUnavailableError;
  }, _RedisClusterSlots_resetSlots = function _RedisClusterSlots_resetSlots() {
    this.slots = new Array(__classPrivateFieldGet(_a, _a, "f", _RedisClusterSlots_SLOTS));
    this.shards = [];
    this.masters = [];
    this.replicas = [];
    __classPrivateFieldSet(this, _RedisClusterSlots_randomNodeIterator, undefined, "f");
  }, _RedisClusterSlots_discover = async function _RedisClusterSlots_discover(rootNode) {
    const addressesInUse = new Set;
    try {
      const shards = await __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_getShards).call(this, rootNode), promises = [], eagerConnect = __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").minimizeConnections !== true;
      __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_resetSlots).call(this);
      for (const { from, to, master, replicas } of shards) {
        const shard = {
          master: __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_initiateSlotNode).call(this, master, false, eagerConnect, addressesInUse, promises)
        };
        if (__classPrivateFieldGet(this, _RedisClusterSlots_options, "f").useReplicas) {
          shard.replicas = replicas.map((replica) => __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_initiateSlotNode).call(this, replica, true, eagerConnect, addressesInUse, promises));
        }
        this.shards.push(shard);
        for (let i = from;i <= to; i++) {
          this.slots[i] = shard;
        }
      }
      if (this.pubSubNode && !addressesInUse.has(this.pubSubNode.address)) {
        if (util_1.types.isPromise(this.pubSubNode.client)) {
          promises.push(this.pubSubNode.client.then((client) => client.disconnect()));
          this.pubSubNode = undefined;
        } else {
          promises.push(this.pubSubNode.client.disconnect());
          const channelsListeners = this.pubSubNode.client.getPubSubListeners(pub_sub_1.PubSubType.CHANNELS), patternsListeners = this.pubSubNode.client.getPubSubListeners(pub_sub_1.PubSubType.PATTERNS);
          if (channelsListeners.size || patternsListeners.size) {
            promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_initiatePubSubClient).call(this, {
              [pub_sub_1.PubSubType.CHANNELS]: channelsListeners,
              [pub_sub_1.PubSubType.PATTERNS]: patternsListeners
            }));
          }
        }
      }
      for (const [address, node4] of this.nodeByAddress.entries()) {
        if (addressesInUse.has(address))
          continue;
        if (node4.client) {
          promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_execOnNodeClient).call(this, node4.client, (client) => client.disconnect()));
        }
        const { pubSubClient } = node4;
        if (pubSubClient) {
          promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_execOnNodeClient).call(this, pubSubClient, (client) => client.disconnect()));
        }
        this.nodeByAddress.delete(address);
      }
      await Promise.all(promises);
      return true;
    } catch (err) {
      __classPrivateFieldGet(this, _RedisClusterSlots_emit, "f").call(this, "error", err);
      return false;
    }
  }, _RedisClusterSlots_getShards = async function _RedisClusterSlots_getShards(rootNode) {
    const client = new (__classPrivateFieldGet(this, _RedisClusterSlots_Client, "f"))(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_clientOptionsDefaults).call(this, rootNode, true));
    client.on("error", (err) => __classPrivateFieldGet(this, _RedisClusterSlots_emit, "f").call(this, "error", err));
    await client.connect();
    try {
      return await client.clusterSlots();
    } finally {
      await client.disconnect();
    }
  }, _RedisClusterSlots_getNodeAddress = function _RedisClusterSlots_getNodeAddress(address) {
    switch (typeof __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").nodeAddressMap) {
      case "object":
        return __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").nodeAddressMap[address];
      case "function":
        return __classPrivateFieldGet(this, _RedisClusterSlots_options, "f").nodeAddressMap(address);
    }
  }, _RedisClusterSlots_clientOptionsDefaults = function _RedisClusterSlots_clientOptionsDefaults(options, disableReconnect) {
    let result;
    if (__classPrivateFieldGet(this, _RedisClusterSlots_options, "f").defaults) {
      let socket;
      if (__classPrivateFieldGet(this, _RedisClusterSlots_options, "f").defaults.socket) {
        socket = {
          ...__classPrivateFieldGet(this, _RedisClusterSlots_options, "f").defaults.socket,
          ...options?.socket
        };
      } else {
        socket = options?.socket;
      }
      result = {
        ...__classPrivateFieldGet(this, _RedisClusterSlots_options, "f").defaults,
        ...options,
        socket
      };
    } else {
      result = options;
    }
    if (disableReconnect) {
      result ?? (result = {});
      result.socket ?? (result.socket = {});
      result.socket.reconnectStrategy = false;
    }
    return result;
  }, _RedisClusterSlots_initiateSlotNode = function _RedisClusterSlots_initiateSlotNode({ id, ip, port }, readonly, eagerConnent, addressesInUse, promises) {
    const address = `${ip}:${port}`;
    addressesInUse.add(address);
    let node4 = this.nodeByAddress.get(address);
    if (!node4) {
      node4 = {
        id,
        host: ip,
        port,
        address,
        readonly,
        client: undefined
      };
      if (eagerConnent) {
        promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_createNodeClient).call(this, node4));
      }
      this.nodeByAddress.set(address, node4);
    }
    (readonly ? this.replicas : this.masters).push(node4);
    return node4;
  }, _RedisClusterSlots_createClient = async function _RedisClusterSlots_createClient(node4, readonly = node4.readonly) {
    const client = new (__classPrivateFieldGet(this, _RedisClusterSlots_Client, "f"))(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_clientOptionsDefaults).call(this, {
      socket: __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_getNodeAddress).call(this, node4.address) ?? {
        host: node4.host,
        port: node4.port
      },
      readonly
    }));
    client.on("error", (err) => __classPrivateFieldGet(this, _RedisClusterSlots_emit, "f").call(this, "error", err));
    await client.connect();
    return client;
  }, _RedisClusterSlots_createNodeClient = function _RedisClusterSlots_createNodeClient(node4) {
    const promise = __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_createClient).call(this, node4).then((client) => {
      node4.client = client;
      return client;
    }).catch((err) => {
      node4.client = undefined;
      throw err;
    });
    node4.client = promise;
    return promise;
  }, _RedisClusterSlots_rediscover = async function _RedisClusterSlots_rediscover(startWith) {
    if (await __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_discover).call(this, startWith.options))
      return;
    return __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_discoverWithRootNodes).call(this);
  }, _RedisClusterSlots_destroy = async function _RedisClusterSlots_destroy(fn) {
    __classPrivateFieldSet(this, _RedisClusterSlots_isOpen, false, "f");
    const promises = [];
    for (const { master, replicas } of this.shards) {
      if (master.client) {
        promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_execOnNodeClient).call(this, master.client, fn));
      }
      if (master.pubSubClient) {
        promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_execOnNodeClient).call(this, master.pubSubClient, fn));
      }
      if (replicas) {
        for (const { client } of replicas) {
          if (client) {
            promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_execOnNodeClient).call(this, client, fn));
          }
        }
      }
    }
    if (this.pubSubNode) {
      promises.push(__classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_execOnNodeClient).call(this, this.pubSubNode.client, fn));
      this.pubSubNode = undefined;
    }
    __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_resetSlots).call(this);
    this.nodeByAddress.clear();
    await Promise.allSettled(promises);
  }, _RedisClusterSlots_execOnNodeClient = function _RedisClusterSlots_execOnNodeClient(client, fn) {
    return util_1.types.isPromise(client) ? client.then(fn) : fn(client);
  }, _RedisClusterSlots_iterateAllNodes = function* _RedisClusterSlots_iterateAllNodes() {
    let i = Math.floor(Math.random() * (this.masters.length + this.replicas.length));
    if (i < this.masters.length) {
      do {
        yield this.masters[i];
      } while (++i < this.masters.length);
      for (const replica of this.replicas) {
        yield replica;
      }
    } else {
      i -= this.masters.length;
      do {
        yield this.replicas[i];
      } while (++i < this.replicas.length);
    }
    while (true) {
      for (const master of this.masters) {
        yield master;
      }
      for (const replica of this.replicas) {
        yield replica;
      }
    }
  }, _RedisClusterSlots_slotNodesIterator = function* _RedisClusterSlots_slotNodesIterator(slot) {
    let i = Math.floor(Math.random() * (1 + slot.replicas.length));
    if (i < slot.replicas.length) {
      do {
        yield slot.replicas[i];
      } while (++i < slot.replicas.length);
    }
    while (true) {
      yield slot.master;
      for (const replica of slot.replicas) {
        yield replica;
      }
    }
  }, _RedisClusterSlots_initiatePubSubClient = async function _RedisClusterSlots_initiatePubSubClient(toResubscribe) {
    const index = Math.floor(Math.random() * (this.masters.length + this.replicas.length)), node4 = index < this.masters.length ? this.masters[index] : this.replicas[index - this.masters.length];
    this.pubSubNode = {
      address: node4.address,
      client: __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_createClient).call(this, node4, true).then(async (client) => {
        if (toResubscribe) {
          await Promise.all([
            client.extendPubSubListeners(pub_sub_1.PubSubType.CHANNELS, toResubscribe[pub_sub_1.PubSubType.CHANNELS]),
            client.extendPubSubListeners(pub_sub_1.PubSubType.PATTERNS, toResubscribe[pub_sub_1.PubSubType.PATTERNS])
          ]);
        }
        this.pubSubNode.client = client;
        return client;
      }).catch((err) => {
        this.pubSubNode = undefined;
        throw err;
      })
    };
    return this.pubSubNode.client;
  }, _RedisClusterSlots_initiateShardedPubSubClient = function _RedisClusterSlots_initiateShardedPubSubClient(master) {
    const promise = __classPrivateFieldGet(this, _RedisClusterSlots_instances, "m", _RedisClusterSlots_createClient).call(this, master, true).then((client) => {
      client.on("server-sunsubscribe", async (channel, listeners) => {
        try {
          await this.rediscover(client);
          const redirectTo = await this.getShardedPubSubClient(channel);
          redirectTo.extendPubSubChannelListeners(pub_sub_1.PubSubType.SHARDED, channel, listeners);
        } catch (err) {
          __classPrivateFieldGet(this, _RedisClusterSlots_emit, "f").call(this, "sharded-shannel-moved-error", err, channel, listeners);
        }
      });
      master.pubSubClient = client;
      return client;
    }).catch((err) => {
      master.pubSubClient = undefined;
      throw err;
    });
    master.pubSubClient = promise;
    return promise;
  };
  _RedisClusterSlots_SLOTS = { value: 16384 };
  exports.default = RedisClusterSlots;
});

// node_modules/@redis/client/dist/lib/cluster/multi-command.js
var require_multi_command3 = __commonJS((exports) => {
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _RedisClusterMultiCommand_multi;
  var _RedisClusterMultiCommand_executor;
  var _RedisClusterMultiCommand_firstKey;
  Object.defineProperty(exports, "__esModule", { value: true });
  var commands_1 = require_commands();
  var multi_command_1 = require_multi_command();
  var commander_1 = require_commander();
  var _1 = require_cluster();

  class RedisClusterMultiCommand {
    static extend(extensions) {
      return (0, commander_1.attachExtensions)({
        BaseClass: RedisClusterMultiCommand,
        modulesExecutor: RedisClusterMultiCommand.prototype.commandsExecutor,
        modules: extensions?.modules,
        functionsExecutor: RedisClusterMultiCommand.prototype.functionsExecutor,
        functions: extensions?.functions,
        scriptsExecutor: RedisClusterMultiCommand.prototype.scriptsExecutor,
        scripts: extensions?.scripts
      });
    }
    constructor(executor, firstKey) {
      _RedisClusterMultiCommand_multi.set(this, new multi_command_1.default);
      _RedisClusterMultiCommand_executor.set(this, undefined);
      _RedisClusterMultiCommand_firstKey.set(this, undefined);
      Object.defineProperty(this, "EXEC", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.exec
      });
      __classPrivateFieldSet(this, _RedisClusterMultiCommand_executor, executor, "f");
      __classPrivateFieldSet(this, _RedisClusterMultiCommand_firstKey, firstKey, "f");
    }
    commandsExecutor(command, args) {
      const transformedArguments = command.transformArguments(...args);
      __classPrivateFieldSet(this, _RedisClusterMultiCommand_firstKey, __classPrivateFieldGet(this, _RedisClusterMultiCommand_firstKey, "f") ?? _1.default.extractFirstKey(command, args, transformedArguments), "f");
      return this.addCommand(undefined, transformedArguments, command.transformReply);
    }
    addCommand(firstKey, args, transformReply) {
      __classPrivateFieldSet(this, _RedisClusterMultiCommand_firstKey, __classPrivateFieldGet(this, _RedisClusterMultiCommand_firstKey, "f") ?? firstKey, "f");
      __classPrivateFieldGet(this, _RedisClusterMultiCommand_multi, "f").addCommand(args, transformReply);
      return this;
    }
    functionsExecutor(fn, args, name) {
      const transformedArguments = __classPrivateFieldGet(this, _RedisClusterMultiCommand_multi, "f").addFunction(name, fn, args);
      __classPrivateFieldSet(this, _RedisClusterMultiCommand_firstKey, __classPrivateFieldGet(this, _RedisClusterMultiCommand_firstKey, "f") ?? _1.default.extractFirstKey(fn, args, transformedArguments), "f");
      return this;
    }
    scriptsExecutor(script, args) {
      const transformedArguments = __classPrivateFieldGet(this, _RedisClusterMultiCommand_multi, "f").addScript(script, args);
      __classPrivateFieldSet(this, _RedisClusterMultiCommand_firstKey, __classPrivateFieldGet(this, _RedisClusterMultiCommand_firstKey, "f") ?? _1.default.extractFirstKey(script, args, transformedArguments), "f");
      return this;
    }
    async exec(execAsPipeline = false) {
      if (execAsPipeline) {
        return this.execAsPipeline();
      }
      return __classPrivateFieldGet(this, _RedisClusterMultiCommand_multi, "f").handleExecReplies(await __classPrivateFieldGet(this, _RedisClusterMultiCommand_executor, "f").call(this, __classPrivateFieldGet(this, _RedisClusterMultiCommand_multi, "f").queue, __classPrivateFieldGet(this, _RedisClusterMultiCommand_firstKey, "f"), multi_command_1.default.generateChainId()));
    }
    async execAsPipeline() {
      return __classPrivateFieldGet(this, _RedisClusterMultiCommand_multi, "f").transformReplies(await __classPrivateFieldGet(this, _RedisClusterMultiCommand_executor, "f").call(this, __classPrivateFieldGet(this, _RedisClusterMultiCommand_multi, "f").queue, __classPrivateFieldGet(this, _RedisClusterMultiCommand_firstKey, "f")));
    }
  }
  _RedisClusterMultiCommand_multi = new WeakMap, _RedisClusterMultiCommand_executor = new WeakMap, _RedisClusterMultiCommand_firstKey = new WeakMap;
  exports.default = RedisClusterMultiCommand;
  (0, commander_1.attachCommands)({
    BaseClass: RedisClusterMultiCommand,
    commands: commands_1.default,
    executor: RedisClusterMultiCommand.prototype.commandsExecutor
  });
});

// node_modules/@redis/client/dist/lib/cluster/index.js
var require_cluster = __commonJS((exports) => {
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _RedisCluster_instances;
  var _RedisCluster_options;
  var _RedisCluster_slots;
  var _RedisCluster_Multi;
  var _RedisCluster_execute;
  Object.defineProperty(exports, "__esModule", { value: true });
  var commands_1 = require_commands();
  var cluster_slots_1 = require_cluster_slots();
  var commander_1 = require_commander();
  var events_1 = import.meta.require("events");
  var multi_command_1 = require_multi_command3();
  var errors_1 = require_errors();

  class RedisCluster extends events_1.EventEmitter {
    static extractFirstKey(command, originalArgs, redisArgs) {
      if (command.FIRST_KEY_INDEX === undefined) {
        return;
      } else if (typeof command.FIRST_KEY_INDEX === "number") {
        return redisArgs[command.FIRST_KEY_INDEX];
      }
      return command.FIRST_KEY_INDEX(...originalArgs);
    }
    static create(options) {
      return new ((0, commander_1.attachExtensions)({
        BaseClass: RedisCluster,
        modulesExecutor: RedisCluster.prototype.commandsExecutor,
        modules: options?.modules,
        functionsExecutor: RedisCluster.prototype.functionsExecutor,
        functions: options?.functions,
        scriptsExecutor: RedisCluster.prototype.scriptsExecutor,
        scripts: options?.scripts
      }))(options);
    }
    get slots() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").slots;
    }
    get shards() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").shards;
    }
    get masters() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").masters;
    }
    get replicas() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").replicas;
    }
    get nodeByAddress() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").nodeByAddress;
    }
    get pubSubNode() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").pubSubNode;
    }
    get isOpen() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").isOpen;
    }
    constructor(options) {
      super();
      _RedisCluster_instances.add(this);
      _RedisCluster_options.set(this, undefined);
      _RedisCluster_slots.set(this, undefined);
      _RedisCluster_Multi.set(this, undefined);
      Object.defineProperty(this, "multi", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.MULTI
      });
      Object.defineProperty(this, "subscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SUBSCRIBE
      });
      Object.defineProperty(this, "unsubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.UNSUBSCRIBE
      });
      Object.defineProperty(this, "pSubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.PSUBSCRIBE
      });
      Object.defineProperty(this, "pUnsubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.PUNSUBSCRIBE
      });
      Object.defineProperty(this, "sSubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SSUBSCRIBE
      });
      Object.defineProperty(this, "sUnsubscribe", {
        enumerable: true,
        configurable: true,
        writable: true,
        value: this.SUNSUBSCRIBE
      });
      __classPrivateFieldSet(this, _RedisCluster_options, options, "f");
      __classPrivateFieldSet(this, _RedisCluster_slots, new cluster_slots_1.default(options, this.emit.bind(this)), "f");
      __classPrivateFieldSet(this, _RedisCluster_Multi, multi_command_1.default.extend(options), "f");
    }
    duplicate(overrides) {
      return new (Object.getPrototypeOf(this)).constructor({
        ...__classPrivateFieldGet(this, _RedisCluster_options, "f"),
        ...overrides
      });
    }
    connect() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").connect();
    }
    async commandsExecutor(command, args) {
      const { jsArgs, args: redisArgs, options } = (0, commander_1.transformCommandArguments)(command, args);
      return (0, commander_1.transformCommandReply)(command, await this.sendCommand(RedisCluster.extractFirstKey(command, jsArgs, redisArgs), command.IS_READ_ONLY, redisArgs, options), redisArgs.preserve);
    }
    async sendCommand(firstKey, isReadonly, args, options) {
      return __classPrivateFieldGet(this, _RedisCluster_instances, "m", _RedisCluster_execute).call(this, firstKey, isReadonly, (client) => client.sendCommand(args, options));
    }
    async functionsExecutor(fn, args, name) {
      const { args: redisArgs, options } = (0, commander_1.transformCommandArguments)(fn, args);
      return (0, commander_1.transformCommandReply)(fn, await this.executeFunction(name, fn, args, redisArgs, options), redisArgs.preserve);
    }
    async executeFunction(name, fn, originalArgs, redisArgs, options) {
      return __classPrivateFieldGet(this, _RedisCluster_instances, "m", _RedisCluster_execute).call(this, RedisCluster.extractFirstKey(fn, originalArgs, redisArgs), fn.IS_READ_ONLY, (client) => client.executeFunction(name, fn, redisArgs, options));
    }
    async scriptsExecutor(script, args) {
      const { args: redisArgs, options } = (0, commander_1.transformCommandArguments)(script, args);
      return (0, commander_1.transformCommandReply)(script, await this.executeScript(script, args, redisArgs, options), redisArgs.preserve);
    }
    async executeScript(script, originalArgs, redisArgs, options) {
      return __classPrivateFieldGet(this, _RedisCluster_instances, "m", _RedisCluster_execute).call(this, RedisCluster.extractFirstKey(script, originalArgs, redisArgs), script.IS_READ_ONLY, (client) => client.executeScript(script, redisArgs, options));
    }
    MULTI(routing) {
      return new (__classPrivateFieldGet(this, _RedisCluster_Multi, "f"))((commands, firstKey, chainId) => {
        return __classPrivateFieldGet(this, _RedisCluster_instances, "m", _RedisCluster_execute).call(this, firstKey, false, (client) => client.multiExecutor(commands, undefined, chainId));
      }, routing);
    }
    async SUBSCRIBE(channels, listener, bufferMode) {
      return (await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getPubSubClient()).SUBSCRIBE(channels, listener, bufferMode);
    }
    async UNSUBSCRIBE(channels, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").executeUnsubscribeCommand((client) => client.UNSUBSCRIBE(channels, listener, bufferMode));
    }
    async PSUBSCRIBE(patterns, listener, bufferMode) {
      return (await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getPubSubClient()).PSUBSCRIBE(patterns, listener, bufferMode);
    }
    async PUNSUBSCRIBE(patterns, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").executeUnsubscribeCommand((client) => client.PUNSUBSCRIBE(patterns, listener, bufferMode));
    }
    async SSUBSCRIBE(channels, listener, bufferMode) {
      const maxCommandRedirections = __classPrivateFieldGet(this, _RedisCluster_options, "f").maxCommandRedirections ?? 16, firstChannel = Array.isArray(channels) ? channels[0] : channels;
      let client = await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getShardedPubSubClient(firstChannel);
      for (let i = 0;; i++) {
        try {
          return await client.SSUBSCRIBE(channels, listener, bufferMode);
        } catch (err) {
          if (++i > maxCommandRedirections || !(err instanceof errors_1.ErrorReply)) {
            throw err;
          }
          if (err.message.startsWith("MOVED")) {
            await __classPrivateFieldGet(this, _RedisCluster_slots, "f").rediscover(client);
            client = await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getShardedPubSubClient(firstChannel);
            continue;
          }
          throw err;
        }
      }
    }
    SUNSUBSCRIBE(channels, listener, bufferMode) {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").executeShardedUnsubscribeCommand(Array.isArray(channels) ? channels[0] : channels, (client) => client.SUNSUBSCRIBE(channels, listener, bufferMode));
    }
    quit() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").quit();
    }
    disconnect() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").disconnect();
    }
    nodeClient(node4) {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").nodeClient(node4);
    }
    getRandomNode() {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").getRandomNode();
    }
    getSlotRandomNode(slot) {
      return __classPrivateFieldGet(this, _RedisCluster_slots, "f").getSlotRandomNode(slot);
    }
    getMasters() {
      return this.masters;
    }
    getSlotMaster(slot) {
      return this.slots[slot].master;
    }
  }
  _RedisCluster_options = new WeakMap, _RedisCluster_slots = new WeakMap, _RedisCluster_Multi = new WeakMap, _RedisCluster_instances = new WeakSet, _RedisCluster_execute = async function _RedisCluster_execute(firstKey, isReadonly, executor) {
    const maxCommandRedirections = __classPrivateFieldGet(this, _RedisCluster_options, "f").maxCommandRedirections ?? 16;
    let client = await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getClient(firstKey, isReadonly);
    for (let i = 0;; i++) {
      try {
        return await executor(client);
      } catch (err) {
        if (++i > maxCommandRedirections || !(err instanceof errors_1.ErrorReply)) {
          throw err;
        }
        if (err.message.startsWith("ASK")) {
          const address = err.message.substring(err.message.lastIndexOf(" ") + 1);
          let redirectTo = await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getMasterByAddress(address);
          if (!redirectTo) {
            await __classPrivateFieldGet(this, _RedisCluster_slots, "f").rediscover(client);
            redirectTo = await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getMasterByAddress(address);
          }
          if (!redirectTo) {
            throw new Error(`Cannot find node ${address}`);
          }
          await redirectTo.asking();
          client = redirectTo;
          continue;
        } else if (err.message.startsWith("MOVED")) {
          await __classPrivateFieldGet(this, _RedisCluster_slots, "f").rediscover(client);
          client = await __classPrivateFieldGet(this, _RedisCluster_slots, "f").getClient(firstKey, isReadonly);
          continue;
        }
        throw err;
      }
    }
  };
  exports.default = RedisCluster;
  (0, commander_1.attachCommands)({
    BaseClass: RedisCluster,
    commands: commands_1.default,
    executor: RedisCluster.prototype.commandsExecutor
  });
});

// node_modules/@redis/client/dist/lib/lua-script.js
var require_lua_script = __commonJS((exports) => {
  function defineScript(script) {
    return {
      ...script,
      SHA1: scriptSha1(script.SCRIPT)
    };
  }
  function scriptSha1(script) {
    return (0, crypto_1.createHash)("sha1").update(script).digest("hex");
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.scriptSha1 = exports.defineScript = undefined;
  var crypto_1 = import.meta.require("crypto");
  exports.defineScript = defineScript;
  exports.scriptSha1 = scriptSha1;
});

// node_modules/@redis/client/dist/index.js
var require_dist = __commonJS((exports) => {
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.RedisFlushModes = exports.GeoReplyWith = exports.defineScript = exports.createCluster = exports.commandOptions = exports.createClient = undefined;
  var client_1 = require_client();
  var cluster_1 = require_cluster();
  exports.createClient = client_1.default.create;
  exports.commandOptions = client_1.default.commandOptions;
  exports.createCluster = cluster_1.default.create;
  var lua_script_1 = require_lua_script();
  Object.defineProperty(exports, "defineScript", { enumerable: true, get: function() {
    return lua_script_1.defineScript;
  } });
  __exportStar(require_errors(), exports);
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "GeoReplyWith", { enumerable: true, get: function() {
    return generic_transformers_1.GeoReplyWith;
  } });
  var FLUSHALL_1 = require_FLUSHALL();
  Object.defineProperty(exports, "RedisFlushModes", { enumerable: true, get: function() {
    return FLUSHALL_1.RedisFlushModes;
  } });
});

// node_modules/@redis/bloom/dist/commands/bloom/ADD.js
var require_ADD = __commonJS((exports) => {
  function transformArguments(key, item) {
    return ["BF.ADD", key, item];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/bloom/CARD.js
var require_CARD = __commonJS((exports) => {
  function transformArguments(key) {
    return ["BF.CARD", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/bloom/EXISTS.js
var require_EXISTS2 = __commonJS((exports) => {
  function transformArguments(key, item) {
    return ["BF.EXISTS", key, item];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/bloom/INFO.js
var require_INFO2 = __commonJS((exports) => {
  function transformArguments(key) {
    return ["BF.INFO", key];
  }
  function transformReply(reply) {
    return {
      capacity: reply[1],
      size: reply[3],
      numberOfFilters: reply[5],
      numberOfInsertedItems: reply[7],
      expansionRate: reply[9]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/bloom/INSERT.js
var require_INSERT = __commonJS((exports) => {
  function transformArguments(key, items, options) {
    const args = ["BF.INSERT", key];
    if (options?.CAPACITY) {
      args.push("CAPACITY", options.CAPACITY.toString());
    }
    if (options?.ERROR) {
      args.push("ERROR", options.ERROR.toString());
    }
    if (options?.EXPANSION) {
      args.push("EXPANSION", options.EXPANSION.toString());
    }
    if (options?.NOCREATE) {
      args.push("NOCREATE");
    }
    if (options?.NONSCALING) {
      args.push("NONSCALING");
    }
    args.push("ITEMS");
    return (0, generic_transformers_1.pushVerdictArguments)(args, items);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_2 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_2.transformBooleanArrayReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/bloom/LOADCHUNK.js
var require_LOADCHUNK = __commonJS((exports) => {
  function transformArguments(key, iteretor, chunk) {
    return ["BF.LOADCHUNK", key, iteretor.toString(), chunk];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/bloom/MADD.js
var require_MADD = __commonJS((exports) => {
  function transformArguments(key, items) {
    return ["BF.MADD", key, ...items];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanArrayReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/bloom/MEXISTS.js
var require_MEXISTS = __commonJS((exports) => {
  function transformArguments(key, items) {
    return ["BF.MEXISTS", key, ...items];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanArrayReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/bloom/RESERVE.js
var require_RESERVE = __commonJS((exports) => {
  function transformArguments(key, errorRate, capacity, options) {
    const args = ["BF.RESERVE", key, errorRate.toString(), capacity.toString()];
    if (options?.EXPANSION) {
      args.push("EXPANSION", options.EXPANSION.toString());
    }
    if (options?.NONSCALING) {
      args.push("NONSCALING");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/bloom/SCANDUMP.js
var require_SCANDUMP = __commonJS((exports) => {
  function transformArguments(key, iterator) {
    return ["BF.SCANDUMP", key, iterator.toString()];
  }
  function transformReply([iterator, chunk]) {
    return {
      iterator,
      chunk
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/bloom/index.js
var require_bloom = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var ADD = require_ADD();
  var CARD = require_CARD();
  var EXISTS = require_EXISTS2();
  var INFO = require_INFO2();
  var INSERT = require_INSERT();
  var LOADCHUNK = require_LOADCHUNK();
  var MADD = require_MADD();
  var MEXISTS = require_MEXISTS();
  var RESERVE = require_RESERVE();
  var SCANDUMP = require_SCANDUMP();
  exports.default = {
    ADD,
    add: ADD,
    CARD,
    card: CARD,
    EXISTS,
    exists: EXISTS,
    INFO,
    info: INFO,
    INSERT,
    insert: INSERT,
    LOADCHUNK,
    loadChunk: LOADCHUNK,
    MADD,
    mAdd: MADD,
    MEXISTS,
    mExists: MEXISTS,
    RESERVE,
    reserve: RESERVE,
    SCANDUMP,
    scanDump: SCANDUMP
  };
});

// node_modules/@redis/bloom/dist/commands/count-min-sketch/INCRBY.js
var require_INCRBY2 = __commonJS((exports) => {
  function transformArguments(key, items) {
    const args = ["CMS.INCRBY", key];
    if (Array.isArray(items)) {
      for (const item of items) {
        pushIncrByItem(args, item);
      }
    } else {
      pushIncrByItem(args, items);
    }
    return args;
  }
  function pushIncrByItem(args, { item, incrementBy }) {
    args.push(item, incrementBy.toString());
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/count-min-sketch/INFO.js
var require_INFO3 = __commonJS((exports) => {
  function transformArguments(key) {
    return ["CMS.INFO", key];
  }
  function transformReply(reply) {
    return {
      width: reply[1],
      depth: reply[3],
      count: reply[5]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/count-min-sketch/INITBYDIM.js
var require_INITBYDIM = __commonJS((exports) => {
  function transformArguments(key, width, depth) {
    return ["CMS.INITBYDIM", key, width.toString(), depth.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/count-min-sketch/INITBYPROB.js
var require_INITBYPROB = __commonJS((exports) => {
  function transformArguments(key, error, probability) {
    return ["CMS.INITBYPROB", key, error.toString(), probability.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/count-min-sketch/MERGE.js
var require_MERGE = __commonJS((exports) => {
  function transformArguments(dest, src) {
    const args = [
      "CMS.MERGE",
      dest,
      src.length.toString()
    ];
    if (isStringSketches(src)) {
      args.push(...src);
    } else {
      for (const sketch of src) {
        args.push(sketch.name);
      }
      args.push("WEIGHTS");
      for (const sketch of src) {
        args.push(sketch.weight.toString());
      }
    }
    return args;
  }
  function isStringSketches(src) {
    return typeof src[0] === "string";
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/count-min-sketch/QUERY.js
var require_QUERY = __commonJS((exports) => {
  function transformArguments(key, items) {
    return (0, generic_transformers_1.pushVerdictArguments)(["CMS.QUERY", key], items);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/count-min-sketch/index.js
var require_count_min_sketch = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var INCRBY = require_INCRBY2();
  var INFO = require_INFO3();
  var INITBYDIM = require_INITBYDIM();
  var INITBYPROB = require_INITBYPROB();
  var MERGE = require_MERGE();
  var QUERY = require_QUERY();
  exports.default = {
    INCRBY,
    incrBy: INCRBY,
    INFO,
    info: INFO,
    INITBYDIM,
    initByDim: INITBYDIM,
    INITBYPROB,
    initByProb: INITBYPROB,
    MERGE,
    merge: MERGE,
    QUERY,
    query: QUERY
  };
});

// node_modules/@redis/bloom/dist/commands/cuckoo/ADD.js
var require_ADD2 = __commonJS((exports) => {
  function transformArguments(key, item) {
    return ["CF.ADD", key, item];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/cuckoo/ADDNX.js
var require_ADDNX = __commonJS((exports) => {
  function transformArguments(key, item) {
    return ["CF.ADDNX", key, item];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/cuckoo/COUNT.js
var require_COUNT = __commonJS((exports) => {
  function transformArguments(key, item) {
    return ["CF.COUNT", key, item];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/cuckoo/DEL.js
var require_DEL2 = __commonJS((exports) => {
  function transformArguments(key, item) {
    return ["CF.DEL", key, item];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/cuckoo/EXISTS.js
var require_EXISTS3 = __commonJS((exports) => {
  function transformArguments(key, item) {
    return ["CF.EXISTS", key, item];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/cuckoo/INFO.js
var require_INFO4 = __commonJS((exports) => {
  function transformArguments(key) {
    return ["CF.INFO", key];
  }
  function transformReply(reply) {
    return {
      size: reply[1],
      numberOfBuckets: reply[3],
      numberOfFilters: reply[5],
      numberOfInsertedItems: reply[7],
      numberOfDeletedItems: reply[9],
      bucketSize: reply[11],
      expansionRate: reply[13],
      maxIteration: reply[15]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/cuckoo/INSERT.js
var require_INSERT2 = __commonJS((exports) => {
  function transformArguments(key, items, options) {
    return (0, _1.pushInsertOptions)(["CF.INSERT", key], items, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_cuckoo();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanArrayReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/cuckoo/INSERTNX.js
var require_INSERTNX = __commonJS((exports) => {
  function transformArguments(key, items, options) {
    return (0, _1.pushInsertOptions)(["CF.INSERTNX", key], items, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_cuckoo();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanArrayReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/cuckoo/LOADCHUNK.js
var require_LOADCHUNK2 = __commonJS((exports) => {
  function transformArguments(key, iterator, chunk) {
    return ["CF.LOADCHUNK", key, iterator.toString(), chunk];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/cuckoo/RESERVE.js
var require_RESERVE2 = __commonJS((exports) => {
  function transformArguments(key, capacity, options) {
    const args = ["CF.RESERVE", key, capacity.toString()];
    if (options?.BUCKETSIZE) {
      args.push("BUCKETSIZE", options.BUCKETSIZE.toString());
    }
    if (options?.MAXITERATIONS) {
      args.push("MAXITERATIONS", options.MAXITERATIONS.toString());
    }
    if (options?.EXPANSION) {
      args.push("EXPANSION", options.EXPANSION.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/cuckoo/SCANDUMP.js
var require_SCANDUMP2 = __commonJS((exports) => {
  function transformArguments(key, iterator) {
    return ["CF.SCANDUMP", key, iterator.toString()];
  }
  function transformReply([iterator, chunk]) {
    return {
      iterator,
      chunk
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/cuckoo/index.js
var require_cuckoo = __commonJS((exports) => {
  function pushInsertOptions(args, items, options) {
    if (options?.CAPACITY) {
      args.push("CAPACITY");
      args.push(options.CAPACITY.toString());
    }
    if (options?.NOCREATE) {
      args.push("NOCREATE");
    }
    args.push("ITEMS");
    return (0, generic_transformers_1.pushVerdictArguments)(args, items);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.pushInsertOptions = undefined;
  var ADD = require_ADD2();
  var ADDNX = require_ADDNX();
  var COUNT = require_COUNT();
  var DEL = require_DEL2();
  var EXISTS = require_EXISTS3();
  var INFO = require_INFO4();
  var INSERT = require_INSERT2();
  var INSERTNX = require_INSERTNX();
  var LOADCHUNK = require_LOADCHUNK2();
  var RESERVE = require_RESERVE2();
  var SCANDUMP = require_SCANDUMP2();
  var generic_transformers_1 = require_generic_transformers();
  exports.default = {
    ADD,
    add: ADD,
    ADDNX,
    addNX: ADDNX,
    COUNT,
    count: COUNT,
    DEL,
    del: DEL,
    EXISTS,
    exists: EXISTS,
    INFO,
    info: INFO,
    INSERT,
    insert: INSERT,
    INSERTNX,
    insertNX: INSERTNX,
    LOADCHUNK,
    loadChunk: LOADCHUNK,
    RESERVE,
    reserve: RESERVE,
    SCANDUMP,
    scanDump: SCANDUMP
  };
  exports.pushInsertOptions = pushInsertOptions;
});

// node_modules/@redis/bloom/dist/commands/t-digest/ADD.js
var require_ADD3 = __commonJS((exports) => {
  function transformArguments(key, values) {
    const args = ["TDIGEST.ADD", key];
    for (const item of values) {
      args.push(item.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/t-digest/BYRANK.js
var require_BYRANK = __commonJS((exports) => {
  function transformArguments(key, ranks) {
    const args = ["TDIGEST.BYRANK", key];
    for (const rank of ranks) {
      args.push(rank.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_t_digest();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformDoublesReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/t-digest/BYREVRANK.js
var require_BYREVRANK = __commonJS((exports) => {
  function transformArguments(key, ranks) {
    const args = ["TDIGEST.BYREVRANK", key];
    for (const rank of ranks) {
      args.push(rank.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_t_digest();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformDoublesReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/t-digest/CDF.js
var require_CDF = __commonJS((exports) => {
  function transformArguments(key, values) {
    const args = ["TDIGEST.CDF", key];
    for (const item of values) {
      args.push(item.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_t_digest();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformDoublesReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/t-digest/CREATE.js
var require_CREATE = __commonJS((exports) => {
  function transformArguments(key, options) {
    return (0, _1.pushCompressionArgument)(["TDIGEST.CREATE", key], options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_t_digest();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/t-digest/INFO.js
var require_INFO5 = __commonJS((exports) => {
  function transformArguments(key) {
    return [
      "TDIGEST.INFO",
      key
    ];
  }
  function transformReply(reply) {
    return {
      comperssion: reply[1],
      capacity: reply[3],
      mergedNodes: reply[5],
      unmergedNodes: reply[7],
      mergedWeight: Number(reply[9]),
      unmergedWeight: Number(reply[11]),
      totalCompression: reply[13]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/t-digest/MAX.js
var require_MAX = __commonJS((exports) => {
  function transformArguments(key) {
    return [
      "TDIGEST.MAX",
      key
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_t_digest();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformDoubleReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/t-digest/MERGE.js
var require_MERGE2 = __commonJS((exports) => {
  function transformArguments(destKey, srcKeys, options) {
    const args = (0, generic_transformers_1.pushVerdictArgument)(["TDIGEST.MERGE", destKey], srcKeys);
    (0, _1.pushCompressionArgument)(args, options);
    if (options?.OVERRIDE) {
      args.push("OVERRIDE");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var _1 = require_t_digest();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/t-digest/MIN.js
var require_MIN = __commonJS((exports) => {
  function transformArguments(key) {
    return [
      "TDIGEST.MIN",
      key
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_t_digest();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformDoubleReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/t-digest/QUANTILE.js
var require_QUANTILE = __commonJS((exports) => {
  function transformArguments(key, quantiles) {
    const args = [
      "TDIGEST.QUANTILE",
      key
    ];
    for (const quantile of quantiles) {
      args.push(quantile.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_t_digest();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformDoublesReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/t-digest/RANK.js
var require_RANK = __commonJS((exports) => {
  function transformArguments(key, values) {
    const args = ["TDIGEST.RANK", key];
    for (const item of values) {
      args.push(item.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/t-digest/RESET.js
var require_RESET = __commonJS((exports) => {
  function transformArguments(key) {
    return ["TDIGEST.RESET", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/t-digest/REVRANK.js
var require_REVRANK = __commonJS((exports) => {
  function transformArguments(key, values) {
    const args = ["TDIGEST.REVRANK", key];
    for (const item of values) {
      args.push(item.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/t-digest/TRIMMED_MEAN.js
var require_TRIMMED_MEAN = __commonJS((exports) => {
  function transformArguments(key, lowCutPercentile, highCutPercentile) {
    return [
      "TDIGEST.TRIMMED_MEAN",
      key,
      lowCutPercentile.toString(),
      highCutPercentile.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_t_digest();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformDoubleReply;
  } });
});

// node_modules/@redis/bloom/dist/commands/t-digest/index.js
var require_t_digest = __commonJS((exports) => {
  function pushCompressionArgument(args, options) {
    if (options?.COMPRESSION) {
      args.push("COMPRESSION", options.COMPRESSION.toString());
    }
    return args;
  }
  function transformDoubleReply(reply) {
    switch (reply) {
      case "inf":
        return Infinity;
      case "-inf":
        return -Infinity;
      case "nan":
        return NaN;
      default:
        return parseFloat(reply);
    }
  }
  function transformDoublesReply(reply) {
    return reply.map(transformDoubleReply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformDoublesReply = exports.transformDoubleReply = exports.pushCompressionArgument = undefined;
  var ADD = require_ADD3();
  var BYRANK = require_BYRANK();
  var BYREVRANK = require_BYREVRANK();
  var CDF = require_CDF();
  var CREATE = require_CREATE();
  var INFO = require_INFO5();
  var MAX = require_MAX();
  var MERGE = require_MERGE2();
  var MIN = require_MIN();
  var QUANTILE = require_QUANTILE();
  var RANK = require_RANK();
  var RESET = require_RESET();
  var REVRANK = require_REVRANK();
  var TRIMMED_MEAN = require_TRIMMED_MEAN();
  exports.default = {
    ADD,
    add: ADD,
    BYRANK,
    byRank: BYRANK,
    BYREVRANK,
    byRevRank: BYREVRANK,
    CDF,
    cdf: CDF,
    CREATE,
    create: CREATE,
    INFO,
    info: INFO,
    MAX,
    max: MAX,
    MERGE,
    merge: MERGE,
    MIN,
    min: MIN,
    QUANTILE,
    quantile: QUANTILE,
    RANK,
    rank: RANK,
    RESET,
    reset: RESET,
    REVRANK,
    revRank: REVRANK,
    TRIMMED_MEAN,
    trimmedMean: TRIMMED_MEAN
  };
  exports.pushCompressionArgument = pushCompressionArgument;
  exports.transformDoubleReply = transformDoubleReply;
  exports.transformDoublesReply = transformDoublesReply;
});

// node_modules/@redis/bloom/dist/commands/top-k/ADD.js
var require_ADD4 = __commonJS((exports) => {
  function transformArguments(key, items) {
    return (0, generic_transformers_1.pushVerdictArguments)(["TOPK.ADD", key], items);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/top-k/COUNT.js
var require_COUNT2 = __commonJS((exports) => {
  function transformArguments(key, items) {
    return (0, generic_transformers_1.pushVerdictArguments)(["TOPK.COUNT", key], items);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/top-k/INCRBY.js
var require_INCRBY3 = __commonJS((exports) => {
  function transformArguments(key, items) {
    const args = ["TOPK.INCRBY", key];
    if (Array.isArray(items)) {
      for (const item of items) {
        pushIncrByItem(args, item);
      }
    } else {
      pushIncrByItem(args, items);
    }
    return args;
  }
  function pushIncrByItem(args, { item, incrementBy }) {
    args.push(item, incrementBy.toString());
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/top-k/INFO.js
var require_INFO6 = __commonJS((exports) => {
  function transformArguments(key) {
    return ["TOPK.INFO", key];
  }
  function transformReply(reply) {
    return {
      k: reply[1],
      width: reply[3],
      depth: reply[5],
      decay: Number(reply[7])
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/top-k/LIST_WITHCOUNT.js
var require_LIST_WITHCOUNT = __commonJS((exports) => {
  function transformArguments(key) {
    return ["TOPK.LIST", key, "WITHCOUNT"];
  }
  function transformReply(rawReply) {
    const reply = [];
    for (let i = 0;i < rawReply.length; i++) {
      reply.push({
        item: rawReply[i],
        count: rawReply[++i]
      });
    }
    return reply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/bloom/dist/commands/top-k/LIST.js
var require_LIST = __commonJS((exports) => {
  function transformArguments(key) {
    return ["TOPK.LIST", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/top-k/QUERY.js
var require_QUERY2 = __commonJS((exports) => {
  function transformArguments(key, items) {
    return (0, generic_transformers_1.pushVerdictArguments)(["TOPK.QUERY", key], items);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/top-k/RESERVE.js
var require_RESERVE3 = __commonJS((exports) => {
  function transformArguments(key, topK, options) {
    const args = ["TOPK.RESERVE", key, topK.toString()];
    if (options) {
      args.push(options.width.toString(), options.depth.toString(), options.decay.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/bloom/dist/commands/top-k/index.js
var require_top_k = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var ADD = require_ADD4();
  var COUNT = require_COUNT2();
  var INCRBY = require_INCRBY3();
  var INFO = require_INFO6();
  var LIST_WITHCOUNT = require_LIST_WITHCOUNT();
  var LIST = require_LIST();
  var QUERY = require_QUERY2();
  var RESERVE = require_RESERVE3();
  exports.default = {
    ADD,
    add: ADD,
    COUNT,
    count: COUNT,
    INCRBY,
    incrBy: INCRBY,
    INFO,
    info: INFO,
    LIST_WITHCOUNT,
    listWithCount: LIST_WITHCOUNT,
    LIST,
    list: LIST,
    QUERY,
    query: QUERY,
    RESERVE,
    reserve: RESERVE
  };
});

// node_modules/@redis/bloom/dist/commands/index.js
var require_commands3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  var bloom_1 = require_bloom();
  var count_min_sketch_1 = require_count_min_sketch();
  var cuckoo_1 = require_cuckoo();
  var t_digest_1 = require_t_digest();
  var top_k_1 = require_top_k();
  exports.default = {
    bf: bloom_1.default,
    cms: count_min_sketch_1.default,
    cf: cuckoo_1.default,
    tDigest: t_digest_1.default,
    topK: top_k_1.default
  };
});

// node_modules/@redis/bloom/dist/index.js
var require_dist2 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = undefined;
  var commands_1 = require_commands3();
  Object.defineProperty(exports, "default", { enumerable: true, get: function() {
    return commands_1.default;
  } });
});

// node_modules/@redis/graph/dist/commands/CONFIG_GET.js
var require_CONFIG_GET2 = __commonJS((exports) => {
  function transformArguments(configKey) {
    return ["GRAPH.CONFIG", "GET", configKey];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/graph/dist/commands/CONFIG_SET.js
var require_CONFIG_SET2 = __commonJS((exports) => {
  function transformArguments(configKey, value) {
    return [
      "GRAPH.CONFIG",
      "SET",
      configKey,
      value.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/graph/dist/commands/DELETE.js
var require_DELETE = __commonJS((exports) => {
  function transformArguments(key) {
    return ["GRAPH.DELETE", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/graph/dist/commands/EXPLAIN.js
var require_EXPLAIN = __commonJS((exports) => {
  function transformArguments(key, query) {
    return ["GRAPH.EXPLAIN", key, query];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/graph/dist/commands/LIST.js
var require_LIST2 = __commonJS((exports) => {
  function transformArguments() {
    return ["GRAPH.LIST"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/graph/dist/commands/PROFILE.js
var require_PROFILE = __commonJS((exports) => {
  function transformArguments(key, query) {
    return ["GRAPH.PROFILE", key, query];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/graph/dist/commands/QUERY.js
var require_QUERY3 = __commonJS((exports) => {
  function transformArguments(graph, query, options, compact) {
    return (0, _1.pushQueryArguments)(["GRAPH.QUERY"], graph, query, options, compact);
  }
  function transformReply(reply) {
    return reply.length === 1 ? {
      headers: undefined,
      data: undefined,
      metadata: reply[0]
    } : {
      headers: reply[0],
      data: reply[1],
      metadata: reply[2]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands4();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/graph/dist/commands/RO_QUERY.js
var require_RO_QUERY = __commonJS((exports) => {
  function transformArguments(graph, query, options, compact) {
    return (0, _1.pushQueryArguments)(["GRAPH.RO_QUERY"], graph, query, options, compact);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands4();
  var QUERY_1 = require_QUERY3();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return QUERY_1.FIRST_KEY_INDEX;
  } });
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var QUERY_2 = require_QUERY3();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return QUERY_2.transformReply;
  } });
});

// node_modules/@redis/graph/dist/commands/SLOWLOG.js
var require_SLOWLOG = __commonJS((exports) => {
  function transformArguments(key) {
    return ["GRAPH.SLOWLOG", key];
  }
  function transformReply(logs) {
    return logs.map(([timestamp, command, query, took]) => ({
      timestamp: new Date(Number(timestamp) * 1000),
      command,
      query,
      took: Number(took)
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/graph/dist/commands/index.js
var require_commands4 = __commonJS((exports) => {
  function pushQueryArguments(args, graph, query, options, compact) {
    args.push(graph);
    if (typeof options === "number") {
      args.push(query);
      pushTimeout(args, options);
    } else {
      args.push(options?.params ? `CYPHER ${queryParamsToString(options.params)} ${query}` : query);
      if (options?.TIMEOUT !== undefined) {
        pushTimeout(args, options.TIMEOUT);
      }
    }
    if (compact) {
      args.push("--compact");
    }
    return args;
  }
  function pushTimeout(args, timeout) {
    args.push("TIMEOUT", timeout.toString());
  }
  function queryParamsToString(params) {
    const parts = [];
    for (const [key, value] of Object.entries(params)) {
      parts.push(`${key}=${queryParamToString(value)}`);
    }
    return parts.join(" ");
  }
  function queryParamToString(param) {
    if (param === null) {
      return "null";
    }
    switch (typeof param) {
      case "string":
        return `"${param.replace(/["\\]/g, "\\$&")}"`;
      case "number":
      case "boolean":
        return param.toString();
    }
    if (Array.isArray(param)) {
      return `[${param.map(queryParamToString).join(",")}]`;
    } else if (typeof param === "object") {
      const body2 = [];
      for (const [key, value] of Object.entries(param)) {
        body2.push(`${key}:${queryParamToString(value)}`);
      }
      return `{${body2.join(",")}}`;
    } else {
      throw new TypeError(`Unexpected param type ${typeof param} ${param}`);
    }
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.pushQueryArguments = undefined;
  var CONFIG_GET = require_CONFIG_GET2();
  var CONFIG_SET = require_CONFIG_SET2();
  var DELETE = require_DELETE();
  var EXPLAIN = require_EXPLAIN();
  var LIST = require_LIST2();
  var PROFILE = require_PROFILE();
  var QUERY = require_QUERY3();
  var RO_QUERY = require_RO_QUERY();
  var SLOWLOG = require_SLOWLOG();
  exports.default = {
    CONFIG_GET,
    configGet: CONFIG_GET,
    CONFIG_SET,
    configSet: CONFIG_SET,
    DELETE,
    delete: DELETE,
    EXPLAIN,
    explain: EXPLAIN,
    LIST,
    list: LIST,
    PROFILE,
    profile: PROFILE,
    QUERY,
    query: QUERY,
    RO_QUERY,
    roQuery: RO_QUERY,
    SLOWLOG,
    slowLog: SLOWLOG
  };
  exports.pushQueryArguments = pushQueryArguments;
});

// node_modules/@redis/graph/dist/graph.js
var require_graph = __commonJS((exports) => {
  var __classPrivateFieldSet = exports && exports.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = exports && exports.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _Graph_instances;
  var _Graph_client;
  var _Graph_name;
  var _Graph_metadata;
  var _Graph_setMetadataPromise;
  var _Graph_updateMetadata;
  var _Graph_setMetadata;
  var _Graph_cleanMetadataArray;
  var _Graph_getMetadata;
  var _Graph_getMetadataAsync;
  var _Graph_parseReply;
  var _Graph_parseValue;
  var _Graph_parseEdge;
  var _Graph_parseNode;
  var _Graph_parseProperties;
  Object.defineProperty(exports, "__esModule", { value: true });
  var GraphValueTypes;
  (function(GraphValueTypes2) {
    GraphValueTypes2[GraphValueTypes2["UNKNOWN"] = 0] = "UNKNOWN";
    GraphValueTypes2[GraphValueTypes2["NULL"] = 1] = "NULL";
    GraphValueTypes2[GraphValueTypes2["STRING"] = 2] = "STRING";
    GraphValueTypes2[GraphValueTypes2["INTEGER"] = 3] = "INTEGER";
    GraphValueTypes2[GraphValueTypes2["BOOLEAN"] = 4] = "BOOLEAN";
    GraphValueTypes2[GraphValueTypes2["DOUBLE"] = 5] = "DOUBLE";
    GraphValueTypes2[GraphValueTypes2["ARRAY"] = 6] = "ARRAY";
    GraphValueTypes2[GraphValueTypes2["EDGE"] = 7] = "EDGE";
    GraphValueTypes2[GraphValueTypes2["NODE"] = 8] = "NODE";
    GraphValueTypes2[GraphValueTypes2["PATH"] = 9] = "PATH";
    GraphValueTypes2[GraphValueTypes2["MAP"] = 10] = "MAP";
    GraphValueTypes2[GraphValueTypes2["POINT"] = 11] = "POINT";
  })(GraphValueTypes || (GraphValueTypes = {}));

  class Graph {
    constructor(client, name) {
      _Graph_instances.add(this);
      _Graph_client.set(this, undefined);
      _Graph_name.set(this, undefined);
      _Graph_metadata.set(this, undefined);
      _Graph_setMetadataPromise.set(this, undefined);
      __classPrivateFieldSet(this, _Graph_client, client, "f");
      __classPrivateFieldSet(this, _Graph_name, name, "f");
    }
    async query(query, options) {
      return __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseReply).call(this, await __classPrivateFieldGet(this, _Graph_client, "f").graph.query(__classPrivateFieldGet(this, _Graph_name, "f"), query, options, true));
    }
    async roQuery(query, options) {
      return __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseReply).call(this, await __classPrivateFieldGet(this, _Graph_client, "f").graph.roQuery(__classPrivateFieldGet(this, _Graph_name, "f"), query, options, true));
    }
  }
  _Graph_client = new WeakMap, _Graph_name = new WeakMap, _Graph_metadata = new WeakMap, _Graph_setMetadataPromise = new WeakMap, _Graph_instances = new WeakSet, _Graph_updateMetadata = function _Graph_updateMetadata() {
    __classPrivateFieldSet(this, _Graph_setMetadataPromise, __classPrivateFieldGet(this, _Graph_setMetadataPromise, "f") ?? __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_setMetadata).call(this).finally(() => __classPrivateFieldSet(this, _Graph_setMetadataPromise, undefined, "f")), "f");
    return __classPrivateFieldGet(this, _Graph_setMetadataPromise, "f");
  }, _Graph_setMetadata = async function _Graph_setMetadata() {
    const [labels, relationshipTypes, propertyKeys] = await Promise.all([
      __classPrivateFieldGet(this, _Graph_client, "f").graph.roQuery(__classPrivateFieldGet(this, _Graph_name, "f"), "CALL db.labels()"),
      __classPrivateFieldGet(this, _Graph_client, "f").graph.roQuery(__classPrivateFieldGet(this, _Graph_name, "f"), "CALL db.relationshipTypes()"),
      __classPrivateFieldGet(this, _Graph_client, "f").graph.roQuery(__classPrivateFieldGet(this, _Graph_name, "f"), "CALL db.propertyKeys()")
    ]);
    __classPrivateFieldSet(this, _Graph_metadata, {
      labels: __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_cleanMetadataArray).call(this, labels.data),
      relationshipTypes: __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_cleanMetadataArray).call(this, relationshipTypes.data),
      propertyKeys: __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_cleanMetadataArray).call(this, propertyKeys.data)
    }, "f");
    return __classPrivateFieldGet(this, _Graph_metadata, "f");
  }, _Graph_cleanMetadataArray = function _Graph_cleanMetadataArray(arr) {
    return arr.map(([value]) => value);
  }, _Graph_getMetadata = function _Graph_getMetadata(key, id) {
    return __classPrivateFieldGet(this, _Graph_metadata, "f")?.[key][id] ?? __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_getMetadataAsync).call(this, key, id);
  }, _Graph_getMetadataAsync = async function _Graph_getMetadataAsync(key, id) {
    const value = (await __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_updateMetadata).call(this))[key][id];
    if (value === undefined)
      throw new Error(`Cannot find value from ${key}[${id}]`);
    return value;
  }, _Graph_parseReply = async function _Graph_parseReply(reply) {
    if (!reply.data)
      return reply;
    const promises = [], parsed = {
      metadata: reply.metadata,
      data: reply.data.map((row) => {
        const data = {};
        for (let i = 0;i < row.length; i++) {
          data[reply.headers[i][1]] = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseValue).call(this, row[i], promises);
        }
        return data;
      })
    };
    if (promises.length)
      await Promise.all(promises);
    return parsed;
  }, _Graph_parseValue = function _Graph_parseValue([valueType, value], promises) {
    switch (valueType) {
      case GraphValueTypes.NULL:
        return null;
      case GraphValueTypes.STRING:
      case GraphValueTypes.INTEGER:
        return value;
      case GraphValueTypes.BOOLEAN:
        return value === "true";
      case GraphValueTypes.DOUBLE:
        return parseFloat(value);
      case GraphValueTypes.ARRAY:
        return value.map((x) => __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseValue).call(this, x, promises));
      case GraphValueTypes.EDGE:
        return __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseEdge).call(this, value, promises);
      case GraphValueTypes.NODE:
        return __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseNode).call(this, value, promises);
      case GraphValueTypes.PATH:
        return {
          nodes: value[0][1].map(([, node4]) => __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseNode).call(this, node4, promises)),
          edges: value[1][1].map(([, edge]) => __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseEdge).call(this, edge, promises))
        };
      case GraphValueTypes.MAP:
        const map = {};
        for (let i = 0;i < value.length; i++) {
          map[value[i++]] = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseValue).call(this, value[i], promises);
        }
        return map;
      case GraphValueTypes.POINT:
        return {
          latitude: parseFloat(value[0]),
          longitude: parseFloat(value[1])
        };
      default:
        throw new Error(`unknown scalar type: ${valueType}`);
    }
  }, _Graph_parseEdge = function _Graph_parseEdge([id, relationshipTypeId, sourceId, destinationId, properties], promises) {
    const edge = {
      id,
      sourceId,
      destinationId,
      properties: __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseProperties).call(this, properties, promises)
    };
    const relationshipType = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_getMetadata).call(this, "relationshipTypes", relationshipTypeId);
    if (relationshipType instanceof Promise) {
      promises.push(relationshipType.then((value) => edge.relationshipType = value));
    } else {
      edge.relationshipType = relationshipType;
    }
    return edge;
  }, _Graph_parseNode = function _Graph_parseNode([id, labelIds, properties], promises) {
    const labels = new Array(labelIds.length);
    for (let i = 0;i < labelIds.length; i++) {
      const value = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_getMetadata).call(this, "labels", labelIds[i]);
      if (value instanceof Promise) {
        promises.push(value.then((value2) => labels[i] = value2));
      } else {
        labels[i] = value;
      }
    }
    return {
      id,
      labels,
      properties: __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseProperties).call(this, properties, promises)
    };
  }, _Graph_parseProperties = function _Graph_parseProperties(raw3, promises) {
    const parsed = {};
    for (const [id, type, value] of raw3) {
      const parsedValue = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_parseValue).call(this, [type, value], promises), key = __classPrivateFieldGet(this, _Graph_instances, "m", _Graph_getMetadata).call(this, "propertyKeys", id);
      if (key instanceof Promise) {
        promises.push(key.then((key2) => parsed[key2] = parsedValue));
      } else {
        parsed[key] = parsedValue;
      }
    }
    return parsed;
  };
  exports.default = Graph;
});

// node_modules/@redis/graph/dist/index.js
var require_dist3 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Graph = exports.default = undefined;
  var commands_1 = require_commands4();
  Object.defineProperty(exports, "default", { enumerable: true, get: function() {
    return commands_1.default;
  } });
  var graph_1 = require_graph();
  Object.defineProperty(exports, "Graph", { enumerable: true, get: function() {
    return graph_1.default;
  } });
});

// node_modules/@redis/json/dist/commands/ARRAPPEND.js
var require_ARRAPPEND = __commonJS((exports) => {
  function transformArguments(key, path, ...jsons) {
    const args = ["JSON.ARRAPPEND", key, path];
    for (const json of jsons) {
      args.push((0, _1.transformRedisJsonArgument)(json));
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/ARRINDEX.js
var require_ARRINDEX = __commonJS((exports) => {
  function transformArguments(key, path, json, start, stop) {
    const args = ["JSON.ARRINDEX", key, path, (0, _1.transformRedisJsonArgument)(json)];
    if (start !== undefined && start !== null) {
      args.push(start.toString());
      if (stop !== undefined && stop !== null) {
        args.push(stop.toString());
      }
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/ARRINSERT.js
var require_ARRINSERT = __commonJS((exports) => {
  function transformArguments(key, path, index, ...jsons) {
    const args = ["JSON.ARRINSERT", key, path, index.toString()];
    for (const json of jsons) {
      args.push((0, _1.transformRedisJsonArgument)(json));
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/ARRLEN.js
var require_ARRLEN = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.ARRLEN", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/ARRPOP.js
var require_ARRPOP = __commonJS((exports) => {
  function transformArguments(key, path, index) {
    const args = ["JSON.ARRPOP", key];
    if (path) {
      args.push(path);
      if (index !== undefined && index !== null) {
        args.push(index.toString());
      }
    }
    return args;
  }
  function transformReply(reply) {
    if (reply === null)
      return null;
    if (Array.isArray(reply)) {
      return reply.map(_1.transformRedisJsonNullReply);
    }
    return (0, _1.transformRedisJsonNullReply)(reply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/json/dist/commands/ARRTRIM.js
var require_ARRTRIM = __commonJS((exports) => {
  function transformArguments(key, path, start, stop) {
    return ["JSON.ARRTRIM", key, path, start.toString(), stop.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/DEBUG_MEMORY.js
var require_DEBUG_MEMORY = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.DEBUG", "MEMORY", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 2;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/DEL.js
var require_DEL3 = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.DEL", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/FORGET.js
var require_FORGET = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.FORGET", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/GET.js
var require_GET2 = __commonJS((exports) => {
  function transformArguments(key, options) {
    let args = ["JSON.GET", key];
    if (options?.path) {
      args = (0, generic_transformers_1.pushVerdictArguments)(args, options.path);
    }
    if (options?.INDENT) {
      args.push("INDENT", options.INDENT);
    }
    if (options?.NEWLINE) {
      args.push("NEWLINE", options.NEWLINE);
    }
    if (options?.SPACE) {
      args.push("SPACE", options.SPACE);
    }
    if (options?.NOESCAPE) {
      args.push("NOESCAPE");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _1 = require_commands5();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformRedisJsonNullReply;
  } });
});

// node_modules/@redis/json/dist/commands/MERGE.js
var require_MERGE3 = __commonJS((exports) => {
  function transformArguments(key, path, json) {
    return ["JSON.MERGE", key, path, (0, _1.transformRedisJsonArgument)(json)];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/MGET.js
var require_MGET2 = __commonJS((exports) => {
  function transformArguments(keys, path) {
    return [
      "JSON.MGET",
      ...keys,
      path
    ];
  }
  function transformReply(reply) {
    return reply.map(_1.transformRedisJsonNullReply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/json/dist/commands/MSET.js
var require_MSET2 = __commonJS((exports) => {
  function transformArguments(items) {
    const args = new Array(1 + items.length * 3);
    args[0] = "JSON.MSET";
    let argsIndex = 1;
    for (let i = 0;i < items.length; i++) {
      const item = items[i];
      args[argsIndex++] = item.key;
      args[argsIndex++] = item.path;
      args[argsIndex++] = (0, _1.transformRedisJsonArgument)(item.value);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/NUMINCRBY.js
var require_NUMINCRBY = __commonJS((exports) => {
  function transformArguments(key, path, by) {
    return ["JSON.NUMINCRBY", key, path, by.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var _1 = require_commands5();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformNumbersReply;
  } });
});

// node_modules/@redis/json/dist/commands/NUMMULTBY.js
var require_NUMMULTBY = __commonJS((exports) => {
  function transformArguments(key, path, by) {
    return ["JSON.NUMMULTBY", key, path, by.toString()];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
  var _1 = require_commands5();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _1.transformNumbersReply;
  } });
});

// node_modules/@redis/json/dist/commands/OBJKEYS.js
var require_OBJKEYS = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.OBJKEYS", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/OBJLEN.js
var require_OBJLEN = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.OBJLEN", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/RESP.js
var require_RESP = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.RESP", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/SET.js
var require_SET2 = __commonJS((exports) => {
  function transformArguments(key, path, json, options) {
    const args = ["JSON.SET", key, path, (0, _1.transformRedisJsonArgument)(json)];
    if (options?.NX) {
      args.push("NX");
    } else if (options?.XX) {
      args.push("XX");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/STRAPPEND.js
var require_STRAPPEND = __commonJS((exports) => {
  function transformArguments(...[key, pathOrAppend, append]) {
    const args = ["JSON.STRAPPEND", key];
    if (append !== undefined && append !== null) {
      args.push(pathOrAppend, (0, _1.transformRedisJsonArgument)(append));
    } else {
      args.push((0, _1.transformRedisJsonArgument)(pathOrAppend));
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands5();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/STRLEN.js
var require_STRLEN2 = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.STRLEN", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/TYPE.js
var require_TYPE2 = __commonJS((exports) => {
  function transformArguments(key, path) {
    const args = ["JSON.TYPE", key];
    if (path) {
      args.push(path);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/json/dist/commands/index.js
var require_commands5 = __commonJS((exports) => {
  function transformRedisJsonArgument(json) {
    return JSON.stringify(json);
  }
  function transformRedisJsonReply(json) {
    return JSON.parse(json);
  }
  function transformRedisJsonNullReply(json) {
    if (json === null)
      return null;
    return transformRedisJsonReply(json);
  }
  function transformNumbersReply(reply) {
    return JSON.parse(reply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformNumbersReply = exports.transformRedisJsonNullReply = exports.transformRedisJsonReply = exports.transformRedisJsonArgument = undefined;
  var ARRAPPEND = require_ARRAPPEND();
  var ARRINDEX = require_ARRINDEX();
  var ARRINSERT = require_ARRINSERT();
  var ARRLEN = require_ARRLEN();
  var ARRPOP = require_ARRPOP();
  var ARRTRIM = require_ARRTRIM();
  var DEBUG_MEMORY = require_DEBUG_MEMORY();
  var DEL = require_DEL3();
  var FORGET = require_FORGET();
  var GET = require_GET2();
  var MERGE = require_MERGE3();
  var MGET = require_MGET2();
  var MSET = require_MSET2();
  var NUMINCRBY = require_NUMINCRBY();
  var NUMMULTBY = require_NUMMULTBY();
  var OBJKEYS = require_OBJKEYS();
  var OBJLEN = require_OBJLEN();
  var RESP = require_RESP();
  var SET = require_SET2();
  var STRAPPEND = require_STRAPPEND();
  var STRLEN = require_STRLEN2();
  var TYPE = require_TYPE2();
  exports.default = {
    ARRAPPEND,
    arrAppend: ARRAPPEND,
    ARRINDEX,
    arrIndex: ARRINDEX,
    ARRINSERT,
    arrInsert: ARRINSERT,
    ARRLEN,
    arrLen: ARRLEN,
    ARRPOP,
    arrPop: ARRPOP,
    ARRTRIM,
    arrTrim: ARRTRIM,
    DEBUG_MEMORY,
    debugMemory: DEBUG_MEMORY,
    DEL,
    del: DEL,
    FORGET,
    forget: FORGET,
    GET,
    get: GET,
    MERGE,
    merge: MERGE,
    MGET,
    mGet: MGET,
    MSET,
    mSet: MSET,
    NUMINCRBY,
    numIncrBy: NUMINCRBY,
    NUMMULTBY,
    numMultBy: NUMMULTBY,
    OBJKEYS,
    objKeys: OBJKEYS,
    OBJLEN,
    objLen: OBJLEN,
    RESP,
    resp: RESP,
    SET,
    set: SET,
    STRAPPEND,
    strAppend: STRAPPEND,
    STRLEN,
    strLen: STRLEN,
    TYPE,
    type: TYPE
  };
  exports.transformRedisJsonArgument = transformRedisJsonArgument;
  exports.transformRedisJsonReply = transformRedisJsonReply;
  exports.transformRedisJsonNullReply = transformRedisJsonNullReply;
  exports.transformNumbersReply = transformNumbersReply;
});

// node_modules/@redis/json/dist/index.js
var require_dist4 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = undefined;
  var commands_1 = require_commands5();
  Object.defineProperty(exports, "default", { enumerable: true, get: function() {
    return commands_1.default;
  } });
});

// node_modules/@redis/search/dist/commands/_LIST.js
var require__LIST = __commonJS((exports) => {
  function transformArguments() {
    return ["FT._LIST"];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/ALTER.js
var require_ALTER = __commonJS((exports) => {
  function transformArguments(index, schema) {
    const args = ["FT.ALTER", index, "SCHEMA", "ADD"];
    (0, _1.pushSchema)(args, schema);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var _1 = require_commands6();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/AGGREGATE.js
var require_AGGREGATE = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    return pushAggregatehOptions(["FT.AGGREGATE", index, query], options);
  }
  function pushAggregatehOptions(args, options) {
    if (options?.VERBATIM) {
      args.push("VERBATIM");
    }
    if (options?.ADDSCORES) {
      args.push("ADDSCORES");
    }
    if (options?.LOAD) {
      args.push("LOAD");
      (0, _1.pushArgumentsWithLength)(args, () => {
        if (Array.isArray(options.LOAD)) {
          for (const load of options.LOAD) {
            pushLoadField(args, load);
          }
        } else {
          pushLoadField(args, options.LOAD);
        }
      });
    }
    if (options?.STEPS) {
      for (const step of options.STEPS) {
        switch (step.type) {
          case AggregateSteps.GROUPBY:
            args.push("GROUPBY");
            if (!step.properties) {
              args.push("0");
            } else {
              (0, generic_transformers_1.pushVerdictArgument)(args, step.properties);
            }
            if (Array.isArray(step.REDUCE)) {
              for (const reducer of step.REDUCE) {
                pushGroupByReducer(args, reducer);
              }
            } else {
              pushGroupByReducer(args, step.REDUCE);
            }
            break;
          case AggregateSteps.SORTBY:
            (0, _1.pushSortByArguments)(args, "SORTBY", step.BY);
            if (step.MAX) {
              args.push("MAX", step.MAX.toString());
            }
            break;
          case AggregateSteps.APPLY:
            args.push("APPLY", step.expression, "AS", step.AS);
            break;
          case AggregateSteps.LIMIT:
            args.push("LIMIT", step.from.toString(), step.size.toString());
            break;
          case AggregateSteps.FILTER:
            args.push("FILTER", step.expression);
            break;
        }
      }
    }
    (0, _1.pushParamsArgs)(args, options?.PARAMS);
    if (options?.DIALECT) {
      args.push("DIALECT", options.DIALECT.toString());
    }
    if (options?.TIMEOUT !== undefined) {
      args.push("TIMEOUT", options.TIMEOUT.toString());
    }
    return args;
  }
  function pushLoadField(args, toLoad) {
    if (typeof toLoad === "string") {
      args.push(toLoad);
    } else {
      args.push(toLoad.identifier);
      if (toLoad.AS) {
        args.push("AS", toLoad.AS);
      }
    }
  }
  function pushGroupByReducer(args, reducer) {
    args.push("REDUCE", reducer.type);
    switch (reducer.type) {
      case AggregateGroupByReducers.COUNT:
        args.push("0");
        break;
      case AggregateGroupByReducers.COUNT_DISTINCT:
      case AggregateGroupByReducers.COUNT_DISTINCTISH:
      case AggregateGroupByReducers.SUM:
      case AggregateGroupByReducers.MIN:
      case AggregateGroupByReducers.MAX:
      case AggregateGroupByReducers.AVG:
      case AggregateGroupByReducers.STDDEV:
      case AggregateGroupByReducers.TOLIST:
        args.push("1", reducer.property);
        break;
      case AggregateGroupByReducers.QUANTILE:
        args.push("2", reducer.property, reducer.quantile.toString());
        break;
      case AggregateGroupByReducers.FIRST_VALUE: {
        (0, _1.pushArgumentsWithLength)(args, () => {
          args.push(reducer.property);
          if (reducer.BY) {
            args.push("BY");
            if (typeof reducer.BY === "string") {
              args.push(reducer.BY);
            } else {
              args.push(reducer.BY.property);
              if (reducer.BY.direction) {
                args.push(reducer.BY.direction);
              }
            }
          }
        });
        break;
      }
      case AggregateGroupByReducers.RANDOM_SAMPLE:
        args.push("2", reducer.property, reducer.sampleSize.toString());
        break;
    }
    if (reducer.AS) {
      args.push("AS", reducer.AS);
    }
  }
  function transformReply(rawReply) {
    const results = [];
    for (let i = 1;i < rawReply.length; i++) {
      results.push((0, generic_transformers_1.transformTuplesReply)(rawReply[i]));
    }
    return {
      total: rawReply[0],
      results
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.pushAggregatehOptions = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = exports.AggregateGroupByReducers = exports.AggregateSteps = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var _1 = require_commands6();
  var AggregateSteps;
  (function(AggregateSteps2) {
    AggregateSteps2["GROUPBY"] = "GROUPBY";
    AggregateSteps2["SORTBY"] = "SORTBY";
    AggregateSteps2["APPLY"] = "APPLY";
    AggregateSteps2["LIMIT"] = "LIMIT";
    AggregateSteps2["FILTER"] = "FILTER";
  })(AggregateSteps || (exports.AggregateSteps = AggregateSteps = {}));
  var AggregateGroupByReducers;
  (function(AggregateGroupByReducers2) {
    AggregateGroupByReducers2["COUNT"] = "COUNT";
    AggregateGroupByReducers2["COUNT_DISTINCT"] = "COUNT_DISTINCT";
    AggregateGroupByReducers2["COUNT_DISTINCTISH"] = "COUNT_DISTINCTISH";
    AggregateGroupByReducers2["SUM"] = "SUM";
    AggregateGroupByReducers2["MIN"] = "MIN";
    AggregateGroupByReducers2["MAX"] = "MAX";
    AggregateGroupByReducers2["AVG"] = "AVG";
    AggregateGroupByReducers2["STDDEV"] = "STDDEV";
    AggregateGroupByReducers2["QUANTILE"] = "QUANTILE";
    AggregateGroupByReducers2["TOLIST"] = "TOLIST";
    AggregateGroupByReducers2["TO_LIST"] = "TOLIST";
    AggregateGroupByReducers2["FIRST_VALUE"] = "FIRST_VALUE";
    AggregateGroupByReducers2["RANDOM_SAMPLE"] = "RANDOM_SAMPLE";
  })(AggregateGroupByReducers || (exports.AggregateGroupByReducers = AggregateGroupByReducers = {}));
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.pushAggregatehOptions = pushAggregatehOptions;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/AGGREGATE_WITHCURSOR.js
var require_AGGREGATE_WITHCURSOR = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    const args = (0, AGGREGATE_1.transformArguments)(index, query, options);
    args.push("WITHCURSOR");
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  function transformReply(reply) {
    return {
      ...(0, AGGREGATE_1.transformReply)(reply[0]),
      cursor: reply[1]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var AGGREGATE_1 = require_AGGREGATE();
  var AGGREGATE_2 = require_AGGREGATE();
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return AGGREGATE_2.FIRST_KEY_INDEX;
  } });
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return AGGREGATE_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/ALIASADD.js
var require_ALIASADD = __commonJS((exports) => {
  function transformArguments(name, index) {
    return ["FT.ALIASADD", name, index];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/ALIASDEL.js
var require_ALIASDEL = __commonJS((exports) => {
  function transformArguments(name, index) {
    return ["FT.ALIASDEL", name, index];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/ALIASUPDATE.js
var require_ALIASUPDATE = __commonJS((exports) => {
  function transformArguments(name, index) {
    return ["FT.ALIASUPDATE", name, index];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/CONFIG_GET.js
var require_CONFIG_GET3 = __commonJS((exports) => {
  function transformArguments(option) {
    return ["FT.CONFIG", "GET", option];
  }
  function transformReply(rawReply) {
    const transformedReply = Object.create(null);
    for (const [key, value] of rawReply) {
      transformedReply[key] = value;
    }
    return transformedReply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/CONFIG_SET.js
var require_CONFIG_SET3 = __commonJS((exports) => {
  function transformArguments(option, value) {
    return ["FT.CONFIG", "SET", option, value];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/CREATE.js
var require_CREATE2 = __commonJS((exports) => {
  function transformArguments(index, schema, options) {
    const args = ["FT.CREATE", index];
    if (options?.ON) {
      args.push("ON", options.ON);
    }
    (0, generic_transformers_1.pushOptionalVerdictArgument)(args, "PREFIX", options?.PREFIX);
    if (options?.FILTER) {
      args.push("FILTER", options.FILTER);
    }
    if (options?.LANGUAGE) {
      args.push("LANGUAGE", options.LANGUAGE);
    }
    if (options?.LANGUAGE_FIELD) {
      args.push("LANGUAGE_FIELD", options.LANGUAGE_FIELD);
    }
    if (options?.SCORE) {
      args.push("SCORE", options.SCORE.toString());
    }
    if (options?.SCORE_FIELD) {
      args.push("SCORE_FIELD", options.SCORE_FIELD);
    }
    if (options?.MAXTEXTFIELDS) {
      args.push("MAXTEXTFIELDS");
    }
    if (options?.TEMPORARY) {
      args.push("TEMPORARY", options.TEMPORARY.toString());
    }
    if (options?.NOOFFSETS) {
      args.push("NOOFFSETS");
    }
    if (options?.NOHL) {
      args.push("NOHL");
    }
    if (options?.NOFIELDS) {
      args.push("NOFIELDS");
    }
    if (options?.NOFREQS) {
      args.push("NOFREQS");
    }
    if (options?.SKIPINITIALSCAN) {
      args.push("SKIPINITIALSCAN");
    }
    (0, generic_transformers_1.pushOptionalVerdictArgument)(args, "STOPWORDS", options?.STOPWORDS);
    args.push("SCHEMA");
    (0, _1.pushSchema)(args, schema);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  var _1 = require_commands6();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/CURSOR_DEL.js
var require_CURSOR_DEL = __commonJS((exports) => {
  function transformArguments(index, cursorId) {
    return [
      "FT.CURSOR",
      "DEL",
      index,
      cursorId.toString()
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/CURSOR_READ.js
var require_CURSOR_READ = __commonJS((exports) => {
  function transformArguments(index, cursor, options) {
    const args = [
      "FT.CURSOR",
      "READ",
      index,
      cursor.toString()
    ];
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var AGGREGATE_WITHCURSOR_1 = require_AGGREGATE_WITHCURSOR();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return AGGREGATE_WITHCURSOR_1.transformReply;
  } });
});

// node_modules/@redis/search/dist/commands/DICTADD.js
var require_DICTADD = __commonJS((exports) => {
  function transformArguments(dictionary, term) {
    return (0, generic_transformers_1.pushVerdictArguments)(["FT.DICTADD", dictionary], term);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/DICTDEL.js
var require_DICTDEL = __commonJS((exports) => {
  function transformArguments(dictionary, term) {
    return (0, generic_transformers_1.pushVerdictArguments)(["FT.DICTDEL", dictionary], term);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/DICTDUMP.js
var require_DICTDUMP = __commonJS((exports) => {
  function transformArguments(dictionary) {
    return ["FT.DICTDUMP", dictionary];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/DROPINDEX.js
var require_DROPINDEX = __commonJS((exports) => {
  function transformArguments(index, options) {
    const args = ["FT.DROPINDEX", index];
    if (options?.DD) {
      args.push("DD");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/EXPLAIN.js
var require_EXPLAIN2 = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    const args = ["FT.EXPLAIN", index, query];
    (0, _1.pushParamsArgs)(args, options?.PARAMS);
    if (options?.DIALECT) {
      args.push("DIALECT", options.DIALECT.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var _1 = require_commands6();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/EXPLAINCLI.js
var require_EXPLAINCLI = __commonJS((exports) => {
  function transformArguments(index, query) {
    return ["FT.EXPLAINCLI", index, query];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/INFO.js
var require_INFO7 = __commonJS((exports) => {
  function transformArguments(index) {
    return ["FT.INFO", index];
  }
  function transformReply(rawReply) {
    return {
      indexName: rawReply[1],
      indexOptions: rawReply[3],
      indexDefinition: (0, generic_transformers_1.transformTuplesReply)(rawReply[5]),
      attributes: rawReply[7].map((attribute) => (0, generic_transformers_1.transformTuplesReply)(attribute)),
      numDocs: rawReply[9],
      maxDocId: rawReply[11],
      numTerms: rawReply[13],
      numRecords: rawReply[15],
      invertedSzMb: rawReply[17],
      vectorIndexSzMb: rawReply[19],
      totalInvertedIndexBlocks: rawReply[21],
      offsetVectorsSzMb: rawReply[23],
      docTableSizeMb: rawReply[25],
      sortableValuesSizeMb: rawReply[27],
      keyTableSizeMb: rawReply[29],
      recordsPerDocAvg: rawReply[31],
      bytesPerRecordAvg: rawReply[33],
      offsetsPerTermAvg: rawReply[35],
      offsetBitsPerRecordAvg: rawReply[37],
      hashIndexingFailures: rawReply[39],
      indexing: rawReply[41],
      percentIndexed: rawReply[43],
      gcStats: {
        bytesCollected: rawReply[45][1],
        totalMsRun: rawReply[45][3],
        totalCycles: rawReply[45][5],
        averageCycleTimeMs: rawReply[45][7],
        lastRunTimeMs: rawReply[45][9],
        gcNumericTreesMissed: rawReply[45][11],
        gcBlocksDenied: rawReply[45][13]
      },
      cursorStats: {
        globalIdle: rawReply[47][1],
        globalTotal: rawReply[47][3],
        indexCapacity: rawReply[47][5],
        idnexTotal: rawReply[47][7]
      },
      stopWords: rawReply[49]
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/SEARCH.js
var require_SEARCH = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    return (0, _1.pushSearchOptions)(["FT.SEARCH", index, query], options);
  }
  function transformReply(reply, withoutDocuments) {
    const documents = [];
    let i = 1;
    while (i < reply.length) {
      documents.push({
        id: reply[i++],
        value: withoutDocuments ? Object.create(null) : documentValue(reply[i++])
      });
    }
    return {
      total: reply[0],
      documents
    };
  }
  function documentValue(tuples) {
    const message = Object.create(null);
    let i = 0;
    while (i < tuples.length) {
      const key = tuples[i++], value = tuples[i++];
      if (key === "$") {
        try {
          Object.assign(message, JSON.parse(value));
          continue;
        } catch {
        }
      }
      message[key] = value;
    }
    return message;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands6();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/PROFILE_SEARCH.js
var require_PROFILE_SEARCH = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    let args = ["FT.PROFILE", index, "SEARCH"];
    if (options?.LIMITED) {
      args.push("LIMITED");
    }
    args.push("QUERY", query);
    return (0, _1.pushSearchOptions)(args, options);
  }
  function transformReply(reply, withoutDocuments) {
    return {
      results: (0, SEARCH_1.transformReply)(reply[0], withoutDocuments),
      profile: (0, _1.transformProfile)(reply[1])
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var SEARCH_1 = require_SEARCH();
  var _1 = require_commands6();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/PROFILE_AGGREGATE.js
var require_PROFILE_AGGREGATE = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    const args = ["FT.PROFILE", index, "AGGREGATE"];
    if (options?.LIMITED) {
      args.push("LIMITED");
    }
    args.push("QUERY", query);
    (0, AGGREGATE_1.pushAggregatehOptions)(args, options);
    return args;
  }
  function transformReply(reply) {
    return {
      results: (0, AGGREGATE_1.transformReply)(reply[0]),
      profile: (0, _1.transformProfile)(reply[1])
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var AGGREGATE_1 = require_AGGREGATE();
  var _1 = require_commands6();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/SEARCH_NOCONTENT.js
var require_SEARCH_NOCONTENT = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    return (0, _1.pushSearchOptions)(["FT.SEARCH", index, query, "NOCONTENT"], options);
  }
  function transformReply(reply) {
    return {
      total: reply[0],
      documents: reply.slice(1)
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands6();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/SPELLCHECK.js
var require_SPELLCHECK = __commonJS((exports) => {
  function transformArguments(index, query, options) {
    const args = ["FT.SPELLCHECK", index, query];
    if (options?.DISTANCE) {
      args.push("DISTANCE", options.DISTANCE.toString());
    }
    if (options?.TERMS) {
      if (Array.isArray(options.TERMS)) {
        for (const term of options.TERMS) {
          pushTerms(args, term);
        }
      } else {
        pushTerms(args, options.TERMS);
      }
    }
    if (options?.DIALECT) {
      args.push("DIALECT", options.DIALECT.toString());
    }
    return args;
  }
  function pushTerms(args, { mode, dictionary }) {
    args.push("TERMS", mode, dictionary);
  }
  function transformReply(rawReply) {
    return rawReply.map(([, term, suggestions]) => ({
      term,
      suggestions: suggestions.map(([score, suggestion]) => ({
        score: Number(score),
        suggestion
      }))
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/SUGADD.js
var require_SUGADD = __commonJS((exports) => {
  function transformArguments(key, string, score, options) {
    const args = ["FT.SUGADD", key, string, score.toString()];
    if (options?.INCR) {
      args.push("INCR");
    }
    if (options?.PAYLOAD) {
      args.push("PAYLOAD", options.PAYLOAD);
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/SUGDEL.js
var require_SUGDEL = __commonJS((exports) => {
  function transformArguments(key, string) {
    return ["FT.SUGDEL", key, string];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
  var generic_transformers_1 = require_generic_transformers();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return generic_transformers_1.transformBooleanReply;
  } });
});

// node_modules/@redis/search/dist/commands/SUGGET.js
var require_SUGGET = __commonJS((exports) => {
  function transformArguments(key, prefix, options) {
    const args = ["FT.SUGGET", key, prefix];
    if (options?.FUZZY) {
      args.push("FUZZY");
    }
    if (options?.MAX) {
      args.push("MAX", options.MAX.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/SUGGET_WITHPAYLOADS.js
var require_SUGGET_WITHPAYLOADS = __commonJS((exports) => {
  function transformArguments(key, prefix, options) {
    return [
      ...(0, SUGGET_1.transformArguments)(key, prefix, options),
      "WITHPAYLOADS"
    ];
  }
  function transformReply(rawReply) {
    if (rawReply === null)
      return null;
    const transformedReply = [];
    for (let i = 0;i < rawReply.length; i += 2) {
      transformedReply.push({
        suggestion: rawReply[i],
        payload: rawReply[i + 1]
      });
    }
    return transformedReply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var SUGGET_1 = require_SUGGET();
  var SUGGET_2 = require_SUGGET();
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return SUGGET_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/SUGGET_WITHSCORES_WITHPAYLOADS.js
var require_SUGGET_WITHSCORES_WITHPAYLOADS = __commonJS((exports) => {
  function transformArguments(key, prefix, options) {
    return [
      ...(0, SUGGET_1.transformArguments)(key, prefix, options),
      "WITHSCORES",
      "WITHPAYLOADS"
    ];
  }
  function transformReply(rawReply) {
    if (rawReply === null)
      return null;
    const transformedReply = [];
    for (let i = 0;i < rawReply.length; i += 3) {
      transformedReply.push({
        suggestion: rawReply[i],
        score: Number(rawReply[i + 1]),
        payload: rawReply[i + 2]
      });
    }
    return transformedReply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var SUGGET_1 = require_SUGGET();
  var SUGGET_2 = require_SUGGET();
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return SUGGET_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/SUGGET_WITHSCORES.js
var require_SUGGET_WITHSCORES = __commonJS((exports) => {
  function transformArguments(key, prefix, options) {
    return [
      ...(0, SUGGET_1.transformArguments)(key, prefix, options),
      "WITHSCORES"
    ];
  }
  function transformReply(rawReply) {
    if (rawReply === null)
      return null;
    const transformedReply = [];
    for (let i = 0;i < rawReply.length; i += 2) {
      transformedReply.push({
        suggestion: rawReply[i],
        score: Number(rawReply[i + 1])
      });
    }
    return transformedReply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var SUGGET_1 = require_SUGGET();
  var SUGGET_2 = require_SUGGET();
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return SUGGET_2.IS_READ_ONLY;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/search/dist/commands/SUGLEN.js
var require_SUGLEN = __commonJS((exports) => {
  function transformArguments(key) {
    return ["FT.SUGLEN", key];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/SYNDUMP.js
var require_SYNDUMP = __commonJS((exports) => {
  function transformArguments(index) {
    return ["FT.SYNDUMP", index];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/SYNUPDATE.js
var require_SYNUPDATE = __commonJS((exports) => {
  function transformArguments(index, groupId, terms, options) {
    const args = ["FT.SYNUPDATE", index, groupId];
    if (options?.SKIPINITIALSCAN) {
      args.push("SKIPINITIALSCAN");
    }
    return (0, generic_transformers_1.pushVerdictArguments)(args, terms);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/TAGVALS.js
var require_TAGVALS = __commonJS((exports) => {
  function transformArguments(index, fieldName) {
    return ["FT.TAGVALS", index, fieldName];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = undefined;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/search/dist/commands/index.js
var require_commands6 = __commonJS((exports) => {
  function pushSortByProperty(args, sortBy) {
    if (typeof sortBy === "string") {
      args.push(sortBy);
    } else {
      args.push(sortBy.BY);
      if (sortBy.DIRECTION) {
        args.push(sortBy.DIRECTION);
      }
    }
  }
  function pushSortByArguments(args, name, sortBy) {
    const lengthBefore = args.push(name, "");
    if (Array.isArray(sortBy)) {
      for (const field of sortBy) {
        pushSortByProperty(args, field);
      }
    } else {
      pushSortByProperty(args, sortBy);
    }
    args[lengthBefore - 1] = (args.length - lengthBefore).toString();
    return args;
  }
  function pushArgumentsWithLength(args, fn) {
    const lengthIndex = args.push("") - 1;
    fn(args);
    args[lengthIndex] = (args.length - lengthIndex - 1).toString();
    return args;
  }
  function pushCommonFieldArguments(args, fieldOptions) {
    if (fieldOptions.SORTABLE) {
      args.push("SORTABLE");
      if (fieldOptions.SORTABLE === "UNF") {
        args.push("UNF");
      }
    }
    if (fieldOptions.NOINDEX) {
      args.push("NOINDEX");
    }
  }
  function pushSchema(args, schema) {
    for (const [field, fieldOptions] of Object.entries(schema)) {
      args.push(field);
      if (typeof fieldOptions === "string") {
        args.push(fieldOptions);
        continue;
      }
      if (fieldOptions.AS) {
        args.push("AS", fieldOptions.AS);
      }
      args.push(fieldOptions.type);
      switch (fieldOptions.type) {
        case SchemaFieldTypes.TEXT:
          if (fieldOptions.NOSTEM) {
            args.push("NOSTEM");
          }
          if (fieldOptions.WEIGHT) {
            args.push("WEIGHT", fieldOptions.WEIGHT.toString());
          }
          if (fieldOptions.PHONETIC) {
            args.push("PHONETIC", fieldOptions.PHONETIC);
          }
          if (fieldOptions.WITHSUFFIXTRIE) {
            args.push("WITHSUFFIXTRIE");
          }
          pushCommonFieldArguments(args, fieldOptions);
          if (fieldOptions.INDEXEMPTY) {
            args.push("INDEXEMPTY");
          }
          break;
        case SchemaFieldTypes.NUMERIC:
        case SchemaFieldTypes.GEO:
          pushCommonFieldArguments(args, fieldOptions);
          break;
        case SchemaFieldTypes.TAG:
          if (fieldOptions.SEPARATOR) {
            args.push("SEPARATOR", fieldOptions.SEPARATOR);
          }
          if (fieldOptions.CASESENSITIVE) {
            args.push("CASESENSITIVE");
          }
          if (fieldOptions.WITHSUFFIXTRIE) {
            args.push("WITHSUFFIXTRIE");
          }
          pushCommonFieldArguments(args, fieldOptions);
          if (fieldOptions.INDEXEMPTY) {
            args.push("INDEXEMPTY");
          }
          break;
        case SchemaFieldTypes.VECTOR:
          args.push(fieldOptions.ALGORITHM);
          pushArgumentsWithLength(args, () => {
            args.push("TYPE", fieldOptions.TYPE, "DIM", fieldOptions.DIM.toString(), "DISTANCE_METRIC", fieldOptions.DISTANCE_METRIC);
            if (fieldOptions.INITIAL_CAP) {
              args.push("INITIAL_CAP", fieldOptions.INITIAL_CAP.toString());
            }
            switch (fieldOptions.ALGORITHM) {
              case VectorAlgorithms.FLAT:
                if (fieldOptions.BLOCK_SIZE) {
                  args.push("BLOCK_SIZE", fieldOptions.BLOCK_SIZE.toString());
                }
                break;
              case VectorAlgorithms.HNSW:
                if (fieldOptions.M) {
                  args.push("M", fieldOptions.M.toString());
                }
                if (fieldOptions.EF_CONSTRUCTION) {
                  args.push("EF_CONSTRUCTION", fieldOptions.EF_CONSTRUCTION.toString());
                }
                if (fieldOptions.EF_RUNTIME) {
                  args.push("EF_RUNTIME", fieldOptions.EF_RUNTIME.toString());
                }
                break;
            }
          });
          break;
        case SchemaFieldTypes.GEOSHAPE:
          if (fieldOptions.COORD_SYSTEM !== undefined) {
            args.push("COORD_SYSTEM", fieldOptions.COORD_SYSTEM);
          }
          pushCommonFieldArguments(args, fieldOptions);
          break;
      }
      if (fieldOptions.INDEXMISSING) {
        args.push("INDEXMISSING");
      }
    }
  }
  function pushParamsArgs(args, params) {
    if (params) {
      const enrties = Object.entries(params);
      args.push("PARAMS", (enrties.length * 2).toString());
      for (const [key, value] of enrties) {
        args.push(key, typeof value === "number" ? value.toString() : value);
      }
    }
    return args;
  }
  function pushSearchOptions(args, options) {
    if (options?.VERBATIM) {
      args.push("VERBATIM");
    }
    if (options?.NOSTOPWORDS) {
      args.push("NOSTOPWORDS");
    }
    (0, generic_transformers_1.pushOptionalVerdictArgument)(args, "INKEYS", options?.INKEYS);
    (0, generic_transformers_1.pushOptionalVerdictArgument)(args, "INFIELDS", options?.INFIELDS);
    (0, generic_transformers_1.pushOptionalVerdictArgument)(args, "RETURN", options?.RETURN);
    if (options?.SUMMARIZE) {
      args.push("SUMMARIZE");
      if (typeof options.SUMMARIZE === "object") {
        if (options.SUMMARIZE.FIELDS) {
          args.push("FIELDS");
          (0, generic_transformers_1.pushVerdictArgument)(args, options.SUMMARIZE.FIELDS);
        }
        if (options.SUMMARIZE.FRAGS) {
          args.push("FRAGS", options.SUMMARIZE.FRAGS.toString());
        }
        if (options.SUMMARIZE.LEN) {
          args.push("LEN", options.SUMMARIZE.LEN.toString());
        }
        if (options.SUMMARIZE.SEPARATOR) {
          args.push("SEPARATOR", options.SUMMARIZE.SEPARATOR);
        }
      }
    }
    if (options?.HIGHLIGHT) {
      args.push("HIGHLIGHT");
      if (typeof options.HIGHLIGHT === "object") {
        if (options.HIGHLIGHT.FIELDS) {
          args.push("FIELDS");
          (0, generic_transformers_1.pushVerdictArgument)(args, options.HIGHLIGHT.FIELDS);
        }
        if (options.HIGHLIGHT.TAGS) {
          args.push("TAGS", options.HIGHLIGHT.TAGS.open, options.HIGHLIGHT.TAGS.close);
        }
      }
    }
    if (options?.SLOP) {
      args.push("SLOP", options.SLOP.toString());
    }
    if (options?.INORDER) {
      args.push("INORDER");
    }
    if (options?.LANGUAGE) {
      args.push("LANGUAGE", options.LANGUAGE);
    }
    if (options?.EXPANDER) {
      args.push("EXPANDER", options.EXPANDER);
    }
    if (options?.SCORER) {
      args.push("SCORER", options.SCORER);
    }
    if (options?.SORTBY) {
      args.push("SORTBY");
      pushSortByProperty(args, options.SORTBY);
    }
    if (options?.LIMIT) {
      args.push("LIMIT", options.LIMIT.from.toString(), options.LIMIT.size.toString());
    }
    if (options?.PARAMS) {
      pushParamsArgs(args, options.PARAMS);
    }
    if (options?.DIALECT) {
      args.push("DIALECT", options.DIALECT.toString());
    }
    if (options?.RETURN?.length === 0) {
      args.preserve = true;
    }
    if (options?.TIMEOUT !== undefined) {
      args.push("TIMEOUT", options.TIMEOUT.toString());
    }
    return args;
  }
  function transformProfile(reply) {
    return {
      totalProfileTime: reply[0][1],
      parsingTime: reply[1][1],
      pipelineCreationTime: reply[2][1],
      iteratorsProfile: transformIterators(reply[3][1])
    };
  }
  function transformIterators(IteratorsProfile) {
    var res = {};
    for (let i = 0;i < IteratorsProfile.length; i += 2) {
      const value = IteratorsProfile[i + 1];
      switch (IteratorsProfile[i]) {
        case "Type":
          res.type = value;
          break;
        case "Counter":
          res.counter = value;
          break;
        case "Time":
          res.time = value;
          break;
        case "Query type":
          res.queryType = value;
          break;
        case "Child iterators":
          res.childIterators = value.map(transformChildIterators);
          break;
      }
    }
    return res;
  }
  function transformChildIterators(IteratorsProfile) {
    var res = {};
    for (let i = 1;i < IteratorsProfile.length; i += 2) {
      const value = IteratorsProfile[i + 1];
      switch (IteratorsProfile[i]) {
        case "Type":
          res.type = value;
          break;
        case "Counter":
          res.counter = value;
          break;
        case "Time":
          res.time = value;
          break;
        case "Size":
          res.size = value;
          break;
        case "Term":
          res.term = value;
          break;
        case "Child iterators":
          res.childIterators = value.map(transformChildIterators);
          break;
      }
    }
    return res;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformProfile = exports.pushSearchOptions = exports.pushParamsArgs = exports.pushSchema = exports.SCHEMA_GEO_SHAPE_COORD_SYSTEM = exports.VectorAlgorithms = exports.SchemaTextFieldPhonetics = exports.SchemaFieldTypes = exports.pushArgumentsWithLength = exports.pushSortByArguments = exports.pushSortByProperty = exports.RedisSearchLanguages = undefined;
  var _LIST = require__LIST();
  var ALTER = require_ALTER();
  var AGGREGATE_WITHCURSOR = require_AGGREGATE_WITHCURSOR();
  var AGGREGATE = require_AGGREGATE();
  var ALIASADD = require_ALIASADD();
  var ALIASDEL = require_ALIASDEL();
  var ALIASUPDATE = require_ALIASUPDATE();
  var CONFIG_GET = require_CONFIG_GET3();
  var CONFIG_SET = require_CONFIG_SET3();
  var CREATE = require_CREATE2();
  var CURSOR_DEL = require_CURSOR_DEL();
  var CURSOR_READ = require_CURSOR_READ();
  var DICTADD = require_DICTADD();
  var DICTDEL = require_DICTDEL();
  var DICTDUMP = require_DICTDUMP();
  var DROPINDEX = require_DROPINDEX();
  var EXPLAIN = require_EXPLAIN2();
  var EXPLAINCLI = require_EXPLAINCLI();
  var INFO = require_INFO7();
  var PROFILESEARCH = require_PROFILE_SEARCH();
  var PROFILEAGGREGATE = require_PROFILE_AGGREGATE();
  var SEARCH = require_SEARCH();
  var SEARCH_NOCONTENT = require_SEARCH_NOCONTENT();
  var SPELLCHECK = require_SPELLCHECK();
  var SUGADD = require_SUGADD();
  var SUGDEL = require_SUGDEL();
  var SUGGET_WITHPAYLOADS = require_SUGGET_WITHPAYLOADS();
  var SUGGET_WITHSCORES_WITHPAYLOADS = require_SUGGET_WITHSCORES_WITHPAYLOADS();
  var SUGGET_WITHSCORES = require_SUGGET_WITHSCORES();
  var SUGGET = require_SUGGET();
  var SUGLEN = require_SUGLEN();
  var SYNDUMP = require_SYNDUMP();
  var SYNUPDATE = require_SYNUPDATE();
  var TAGVALS = require_TAGVALS();
  var generic_transformers_1 = require_generic_transformers();
  exports.default = {
    _LIST,
    _list: _LIST,
    ALTER,
    alter: ALTER,
    AGGREGATE_WITHCURSOR,
    aggregateWithCursor: AGGREGATE_WITHCURSOR,
    AGGREGATE,
    aggregate: AGGREGATE,
    ALIASADD,
    aliasAdd: ALIASADD,
    ALIASDEL,
    aliasDel: ALIASDEL,
    ALIASUPDATE,
    aliasUpdate: ALIASUPDATE,
    CONFIG_GET,
    configGet: CONFIG_GET,
    CONFIG_SET,
    configSet: CONFIG_SET,
    CREATE,
    create: CREATE,
    CURSOR_DEL,
    cursorDel: CURSOR_DEL,
    CURSOR_READ,
    cursorRead: CURSOR_READ,
    DICTADD,
    dictAdd: DICTADD,
    DICTDEL,
    dictDel: DICTDEL,
    DICTDUMP,
    dictDump: DICTDUMP,
    DROPINDEX,
    dropIndex: DROPINDEX,
    EXPLAIN,
    explain: EXPLAIN,
    EXPLAINCLI,
    explainCli: EXPLAINCLI,
    INFO,
    info: INFO,
    PROFILESEARCH,
    profileSearch: PROFILESEARCH,
    PROFILEAGGREGATE,
    profileAggregate: PROFILEAGGREGATE,
    SEARCH,
    search: SEARCH,
    SEARCH_NOCONTENT,
    searchNoContent: SEARCH_NOCONTENT,
    SPELLCHECK,
    spellCheck: SPELLCHECK,
    SUGADD,
    sugAdd: SUGADD,
    SUGDEL,
    sugDel: SUGDEL,
    SUGGET_WITHPAYLOADS,
    sugGetWithPayloads: SUGGET_WITHPAYLOADS,
    SUGGET_WITHSCORES_WITHPAYLOADS,
    sugGetWithScoresWithPayloads: SUGGET_WITHSCORES_WITHPAYLOADS,
    SUGGET_WITHSCORES,
    sugGetWithScores: SUGGET_WITHSCORES,
    SUGGET,
    sugGet: SUGGET,
    SUGLEN,
    sugLen: SUGLEN,
    SYNDUMP,
    synDump: SYNDUMP,
    SYNUPDATE,
    synUpdate: SYNUPDATE,
    TAGVALS,
    tagVals: TAGVALS
  };
  var RedisSearchLanguages;
  (function(RedisSearchLanguages2) {
    RedisSearchLanguages2["ARABIC"] = "Arabic";
    RedisSearchLanguages2["BASQUE"] = "Basque";
    RedisSearchLanguages2["CATALANA"] = "Catalan";
    RedisSearchLanguages2["DANISH"] = "Danish";
    RedisSearchLanguages2["DUTCH"] = "Dutch";
    RedisSearchLanguages2["ENGLISH"] = "English";
    RedisSearchLanguages2["FINNISH"] = "Finnish";
    RedisSearchLanguages2["FRENCH"] = "French";
    RedisSearchLanguages2["GERMAN"] = "German";
    RedisSearchLanguages2["GREEK"] = "Greek";
    RedisSearchLanguages2["HUNGARIAN"] = "Hungarian";
    RedisSearchLanguages2["INDONESAIN"] = "Indonesian";
    RedisSearchLanguages2["IRISH"] = "Irish";
    RedisSearchLanguages2["ITALIAN"] = "Italian";
    RedisSearchLanguages2["LITHUANIAN"] = "Lithuanian";
    RedisSearchLanguages2["NEPALI"] = "Nepali";
    RedisSearchLanguages2["NORWEIGAN"] = "Norwegian";
    RedisSearchLanguages2["PORTUGUESE"] = "Portuguese";
    RedisSearchLanguages2["ROMANIAN"] = "Romanian";
    RedisSearchLanguages2["RUSSIAN"] = "Russian";
    RedisSearchLanguages2["SPANISH"] = "Spanish";
    RedisSearchLanguages2["SWEDISH"] = "Swedish";
    RedisSearchLanguages2["TAMIL"] = "Tamil";
    RedisSearchLanguages2["TURKISH"] = "Turkish";
    RedisSearchLanguages2["CHINESE"] = "Chinese";
  })(RedisSearchLanguages || (exports.RedisSearchLanguages = RedisSearchLanguages = {}));
  exports.pushSortByProperty = pushSortByProperty;
  exports.pushSortByArguments = pushSortByArguments;
  exports.pushArgumentsWithLength = pushArgumentsWithLength;
  var SchemaFieldTypes;
  (function(SchemaFieldTypes2) {
    SchemaFieldTypes2["TEXT"] = "TEXT";
    SchemaFieldTypes2["NUMERIC"] = "NUMERIC";
    SchemaFieldTypes2["GEO"] = "GEO";
    SchemaFieldTypes2["TAG"] = "TAG";
    SchemaFieldTypes2["VECTOR"] = "VECTOR";
    SchemaFieldTypes2["GEOSHAPE"] = "GEOSHAPE";
  })(SchemaFieldTypes || (exports.SchemaFieldTypes = SchemaFieldTypes = {}));
  var SchemaTextFieldPhonetics;
  (function(SchemaTextFieldPhonetics2) {
    SchemaTextFieldPhonetics2["DM_EN"] = "dm:en";
    SchemaTextFieldPhonetics2["DM_FR"] = "dm:fr";
    SchemaTextFieldPhonetics2["FM_PT"] = "dm:pt";
    SchemaTextFieldPhonetics2["DM_ES"] = "dm:es";
  })(SchemaTextFieldPhonetics || (exports.SchemaTextFieldPhonetics = SchemaTextFieldPhonetics = {}));
  var VectorAlgorithms;
  (function(VectorAlgorithms2) {
    VectorAlgorithms2["FLAT"] = "FLAT";
    VectorAlgorithms2["HNSW"] = "HNSW";
  })(VectorAlgorithms || (exports.VectorAlgorithms = VectorAlgorithms = {}));
  exports.SCHEMA_GEO_SHAPE_COORD_SYSTEM = {
    SPHERICAL: "SPHERICAL",
    FLAT: "FLAT"
  };
  exports.pushSchema = pushSchema;
  exports.pushParamsArgs = pushParamsArgs;
  exports.pushSearchOptions = pushSearchOptions;
  exports.transformProfile = transformProfile;
});

// node_modules/@redis/search/dist/index.js
var require_dist5 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.AggregateSteps = exports.AggregateGroupByReducers = exports.VectorAlgorithms = exports.SchemaTextFieldPhonetics = exports.SchemaFieldTypes = exports.RedisSearchLanguages = exports.default = undefined;
  var commands_1 = require_commands6();
  Object.defineProperty(exports, "default", { enumerable: true, get: function() {
    return commands_1.default;
  } });
  var commands_2 = require_commands6();
  Object.defineProperty(exports, "RedisSearchLanguages", { enumerable: true, get: function() {
    return commands_2.RedisSearchLanguages;
  } });
  Object.defineProperty(exports, "SchemaFieldTypes", { enumerable: true, get: function() {
    return commands_2.SchemaFieldTypes;
  } });
  Object.defineProperty(exports, "SchemaTextFieldPhonetics", { enumerable: true, get: function() {
    return commands_2.SchemaTextFieldPhonetics;
  } });
  Object.defineProperty(exports, "VectorAlgorithms", { enumerable: true, get: function() {
    return commands_2.VectorAlgorithms;
  } });
  var AGGREGATE_1 = require_AGGREGATE();
  Object.defineProperty(exports, "AggregateGroupByReducers", { enumerable: true, get: function() {
    return AGGREGATE_1.AggregateGroupByReducers;
  } });
  Object.defineProperty(exports, "AggregateSteps", { enumerable: true, get: function() {
    return AGGREGATE_1.AggregateSteps;
  } });
});

// node_modules/@redis/time-series/dist/commands/ADD.js
var require_ADD5 = __commonJS((exports) => {
  function transformArguments(key, timestamp, value, options) {
    const args = [
      "TS.ADD",
      key,
      (0, _1.transformTimestampArgument)(timestamp),
      value.toString()
    ];
    (0, _1.pushRetentionArgument)(args, options?.RETENTION);
    (0, _1.pushEncodingArgument)(args, options?.ENCODING);
    (0, _1.pushChunkSizeArgument)(args, options?.CHUNK_SIZE);
    if (options?.ON_DUPLICATE) {
      args.push("ON_DUPLICATE", options.ON_DUPLICATE);
    }
    (0, _1.pushLabelsArgument)(args, options?.LABELS);
    (0, _1.pushIgnoreArgument)(args, options?.IGNORE);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/ALTER.js
var require_ALTER2 = __commonJS((exports) => {
  function transformArguments(key, options) {
    const args = ["TS.ALTER", key];
    (0, _1.pushRetentionArgument)(args, options?.RETENTION);
    (0, _1.pushChunkSizeArgument)(args, options?.CHUNK_SIZE);
    (0, _1.pushDuplicatePolicy)(args, options?.DUPLICATE_POLICY);
    (0, _1.pushLabelsArgument)(args, options?.LABELS);
    (0, _1.pushIgnoreArgument)(args, options?.IGNORE);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/CREATE.js
var require_CREATE3 = __commonJS((exports) => {
  function transformArguments(key, options) {
    const args = ["TS.CREATE", key];
    (0, _1.pushRetentionArgument)(args, options?.RETENTION);
    (0, _1.pushEncodingArgument)(args, options?.ENCODING);
    (0, _1.pushChunkSizeArgument)(args, options?.CHUNK_SIZE);
    (0, _1.pushDuplicatePolicy)(args, options?.DUPLICATE_POLICY);
    (0, _1.pushLabelsArgument)(args, options?.LABELS);
    (0, _1.pushIgnoreArgument)(args, options?.IGNORE);
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/CREATERULE.js
var require_CREATERULE = __commonJS((exports) => {
  function transformArguments(sourceKey, destinationKey, aggregationType, bucketDuration, alignTimestamp) {
    const args = [
      "TS.CREATERULE",
      sourceKey,
      destinationKey,
      "AGGREGATION",
      aggregationType,
      bucketDuration.toString()
    ];
    if (alignTimestamp) {
      args.push(alignTimestamp.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/DECRBY.js
var require_DECRBY2 = __commonJS((exports) => {
  function transformArguments(key, value, options) {
    return (0, _1.transformIncrDecrArguments)("TS.DECRBY", key, value, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/DEL.js
var require_DEL4 = __commonJS((exports) => {
  function transformArguments(key, fromTimestamp, toTimestamp) {
    return [
      "TS.DEL",
      key,
      (0, _1.transformTimestampArgument)(fromTimestamp),
      (0, _1.transformTimestampArgument)(toTimestamp)
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRTS_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRTS_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/DELETERULE.js
var require_DELETERULE = __commonJS((exports) => {
  function transformArguments(sourceKey, destinationKey) {
    return [
      "TS.DELETERULE",
      sourceKey,
      destinationKey
    ];
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/GET.js
var require_GET3 = __commonJS((exports) => {
  function transformArguments(key, options) {
    return (0, _1.pushLatestArgument)(["TS.GET", key], options?.LATEST);
  }
  function transformReply(reply) {
    if (reply.length === 0)
      return null;
    return (0, _1.transformSampleReply)(reply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/time-series/dist/commands/INCRBY.js
var require_INCRBY4 = __commonJS((exports) => {
  function transformArguments(key, value, options) {
    return (0, _1.transformIncrDecrArguments)("TS.INCRBY", key, value, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/INFO.js
var require_INFO8 = __commonJS((exports) => {
  function transformArguments(key) {
    return ["TS.INFO", key];
  }
  function transformReply(reply) {
    return {
      totalSamples: reply[1],
      memoryUsage: reply[3],
      firstTimestamp: reply[5],
      lastTimestamp: reply[7],
      retentionTime: reply[9],
      chunkCount: reply[11],
      chunkSize: reply[13],
      chunkType: reply[15],
      duplicatePolicy: reply[17],
      labels: reply[19].map(([name, value]) => ({
        name,
        value
      })),
      sourceKey: reply[21],
      rules: reply[23].map(([key, timeBucket, aggregationType]) => ({
        key,
        timeBucket,
        aggregationType
      }))
    };
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/time-series/dist/commands/INFO_DEBUG.js
var require_INFO_DEBUG = __commonJS((exports) => {
  function transformArguments(key) {
    const args = (0, INFO_1.transformArguments)(key);
    args.push("DEBUG");
    return args;
  }
  function transformReply(rawReply) {
    const reply = (0, INFO_1.transformReply)(rawReply);
    reply.keySelfName = rawReply[25];
    reply.chunks = rawReply[27].map((chunk) => ({
      startTimestamp: chunk[1],
      endTimestamp: chunk[3],
      samples: chunk[5],
      size: chunk[7],
      bytesPerSample: chunk[9]
    }));
    return reply;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.FIRST_KEY_INDEX = exports.IS_READ_ONLY = undefined;
  var INFO_1 = require_INFO8();
  var INFO_2 = require_INFO8();
  Object.defineProperty(exports, "IS_READ_ONLY", { enumerable: true, get: function() {
    return INFO_2.IS_READ_ONLY;
  } });
  Object.defineProperty(exports, "FIRST_KEY_INDEX", { enumerable: true, get: function() {
    return INFO_2.FIRST_KEY_INDEX;
  } });
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/time-series/dist/commands/MADD.js
var require_MADD2 = __commonJS((exports) => {
  function transformArguments(toAdd) {
    const args = ["TS.MADD"];
    for (const { key, timestamp, value } of toAdd) {
      args.push(key, (0, _1.transformTimestampArgument)(timestamp), value.toString());
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/MGET.js
var require_MGET3 = __commonJS((exports) => {
  function transformArguments(filter, options) {
    const args = (0, _1.pushLatestArgument)(["TS.MGET"], options?.LATEST);
    return (0, _1.pushFilterArgument)(args, filter);
  }
  function transformReply(reply) {
    return reply.map(([key, _, sample]) => ({
      key,
      sample: (0, _1.transformSampleReply)(sample)
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var _1 = require_commands7();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/time-series/dist/commands/MGET_WITHLABELS.js
var require_MGET_WITHLABELS = __commonJS((exports) => {
  function transformArguments(filter, options) {
    const args = (0, _1.pushWithLabelsArgument)(["TS.MGET"], options?.SELECTED_LABELS);
    return (0, _1.pushFilterArgument)(args, filter);
  }
  function transformReply(reply) {
    return reply.map(([key, labels, sample]) => ({
      key,
      labels: (0, _1.transformLablesReply)(labels),
      sample: (0, _1.transformSampleReply)(sample)
    }));
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var _1 = require_commands7();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/time-series/dist/commands/QUERYINDEX.js
var require_QUERYINDEX = __commonJS((exports) => {
  function transformArguments(filter) {
    return (0, generic_transformers_1.pushVerdictArguments)(["TS.QUERYINDEX"], filter);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var generic_transformers_1 = require_generic_transformers();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
});

// node_modules/@redis/time-series/dist/commands/RANGE.js
var require_RANGE = __commonJS((exports) => {
  function transformArguments(key, fromTimestamp, toTimestamp, options) {
    return (0, _1.pushRangeArguments)(["TS.RANGE", key], fromTimestamp, toTimestamp, options);
  }
  function transformReply(reply) {
    return (0, _1.transformRangeReply)(reply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/time-series/dist/commands/REVRANGE.js
var require_REVRANGE = __commonJS((exports) => {
  function transformArguments(key, fromTimestamp, toTimestamp, options) {
    return (0, _1.pushRangeArguments)(["TS.REVRANGE", key], fromTimestamp, toTimestamp, options);
  }
  function transformReply(reply) {
    return (0, _1.transformRangeReply)(reply);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = exports.FIRST_KEY_INDEX = undefined;
  var _1 = require_commands7();
  exports.FIRST_KEY_INDEX = 1;
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  exports.transformReply = transformReply;
});

// node_modules/@redis/time-series/dist/commands/MRANGE.js
var require_MRANGE = __commonJS((exports) => {
  function transformArguments(fromTimestamp, toTimestamp, filters, options) {
    return (0, _1.pushMRangeArguments)(["TS.MRANGE"], fromTimestamp, toTimestamp, filters, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var _1 = require_commands7();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _2 = require_commands7();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _2.transformMRangeReply;
  } });
});

// node_modules/@redis/time-series/dist/commands/MRANGE_WITHLABELS.js
var require_MRANGE_WITHLABELS = __commonJS((exports) => {
  function transformArguments(fromTimestamp, toTimestamp, filters, options) {
    return (0, _1.pushMRangeWithLabelsArguments)(["TS.MRANGE"], fromTimestamp, toTimestamp, filters, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var _1 = require_commands7();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _2 = require_commands7();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _2.transformMRangeWithLabelsReply;
  } });
});

// node_modules/@redis/time-series/dist/commands/MREVRANGE.js
var require_MREVRANGE = __commonJS((exports) => {
  function transformArguments(fromTimestamp, toTimestamp, filters, options) {
    return (0, _1.pushMRangeArguments)(["TS.MREVRANGE"], fromTimestamp, toTimestamp, filters, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var _1 = require_commands7();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _2 = require_commands7();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _2.transformMRangeReply;
  } });
});

// node_modules/@redis/time-series/dist/commands/MREVRANGE_WITHLABELS.js
var require_MREVRANGE_WITHLABELS = __commonJS((exports) => {
  function transformArguments(fromTimestamp, toTimestamp, filters, options) {
    return (0, _1.pushMRangeWithLabelsArguments)(["TS.MREVRANGE"], fromTimestamp, toTimestamp, filters, options);
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.transformReply = exports.transformArguments = exports.IS_READ_ONLY = undefined;
  var _1 = require_commands7();
  exports.IS_READ_ONLY = true;
  exports.transformArguments = transformArguments;
  var _2 = require_commands7();
  Object.defineProperty(exports, "transformReply", { enumerable: true, get: function() {
    return _2.transformMRangeWithLabelsReply;
  } });
});

// node_modules/@redis/time-series/dist/commands/index.js
var require_commands7 = __commonJS((exports) => {
  function transformTimestampArgument(timestamp) {
    if (typeof timestamp === "string")
      return timestamp;
    return (typeof timestamp === "number" ? timestamp : timestamp.getTime()).toString();
  }
  function pushIgnoreArgument(args, ignore) {
    if (ignore !== undefined) {
      args.push("IGNORE", ignore.MAX_TIME_DIFF.toString(), ignore.MAX_VAL_DIFF.toString());
    }
  }
  function pushRetentionArgument(args, retention) {
    if (retention !== undefined) {
      args.push("RETENTION", retention.toString());
    }
    return args;
  }
  function pushEncodingArgument(args, encoding) {
    if (encoding !== undefined) {
      args.push("ENCODING", encoding);
    }
    return args;
  }
  function pushChunkSizeArgument(args, chunkSize) {
    if (chunkSize !== undefined) {
      args.push("CHUNK_SIZE", chunkSize.toString());
    }
    return args;
  }
  function pushDuplicatePolicy(args, duplicatePolicy) {
    if (duplicatePolicy !== undefined) {
      args.push("DUPLICATE_POLICY", duplicatePolicy);
    }
    return args;
  }
  function transformLablesReply(reply) {
    const labels = {};
    for (const [key, value] of reply) {
      labels[key] = value;
    }
    return labels;
  }
  function pushLabelsArgument(args, labels) {
    if (labels) {
      args.push("LABELS");
      for (const [label, value] of Object.entries(labels)) {
        args.push(label, value);
      }
    }
    return args;
  }
  function transformIncrDecrArguments(command, key, value, options) {
    const args = [
      command,
      key,
      value.toString()
    ];
    if (options?.TIMESTAMP !== undefined && options?.TIMESTAMP !== null) {
      args.push("TIMESTAMP", transformTimestampArgument(options.TIMESTAMP));
    }
    pushRetentionArgument(args, options?.RETENTION);
    if (options?.UNCOMPRESSED) {
      args.push("UNCOMPRESSED");
    }
    pushChunkSizeArgument(args, options?.CHUNK_SIZE);
    pushLabelsArgument(args, options?.LABELS);
    return args;
  }
  function transformSampleReply(reply) {
    return {
      timestamp: reply[0],
      value: Number(reply[1])
    };
  }
  function pushRangeArguments(args, fromTimestamp, toTimestamp, options) {
    args.push(transformTimestampArgument(fromTimestamp), transformTimestampArgument(toTimestamp));
    pushLatestArgument(args, options?.LATEST);
    if (options?.FILTER_BY_TS) {
      args.push("FILTER_BY_TS");
      for (const ts of options.FILTER_BY_TS) {
        args.push(transformTimestampArgument(ts));
      }
    }
    if (options?.FILTER_BY_VALUE) {
      args.push("FILTER_BY_VALUE", options.FILTER_BY_VALUE.min.toString(), options.FILTER_BY_VALUE.max.toString());
    }
    if (options?.COUNT) {
      args.push("COUNT", options.COUNT.toString());
    }
    if (options?.ALIGN) {
      args.push("ALIGN", transformTimestampArgument(options.ALIGN));
    }
    if (options?.AGGREGATION) {
      args.push("AGGREGATION", options.AGGREGATION.type, transformTimestampArgument(options.AGGREGATION.timeBucket));
      if (options.AGGREGATION.BUCKETTIMESTAMP) {
        args.push("BUCKETTIMESTAMP", options.AGGREGATION.BUCKETTIMESTAMP);
      }
      if (options.AGGREGATION.EMPTY) {
        args.push("EMPTY");
      }
    }
    return args;
  }
  function pushMRangeGroupByArguments(args, groupBy) {
    if (groupBy) {
      args.push("GROUPBY", groupBy.label, "REDUCE", groupBy.reducer);
    }
    return args;
  }
  function pushFilterArgument(args, filter) {
    args.push("FILTER");
    return (0, generic_transformers_1.pushVerdictArguments)(args, filter);
  }
  function pushMRangeArguments(args, fromTimestamp, toTimestamp, filter, options) {
    args = pushRangeArguments(args, fromTimestamp, toTimestamp, options);
    args = pushFilterArgument(args, filter);
    return pushMRangeGroupByArguments(args, options?.GROUPBY);
  }
  function pushWithLabelsArgument(args, selectedLabels) {
    if (!selectedLabels) {
      args.push("WITHLABELS");
    } else {
      args.push("SELECTED_LABELS");
      args = (0, generic_transformers_1.pushVerdictArguments)(args, selectedLabels);
    }
    return args;
  }
  function pushMRangeWithLabelsArguments(args, fromTimestamp, toTimestamp, filter, options) {
    args = pushRangeArguments(args, fromTimestamp, toTimestamp, options);
    args = pushWithLabelsArgument(args, options?.SELECTED_LABELS);
    args = pushFilterArgument(args, filter);
    return pushMRangeGroupByArguments(args, options?.GROUPBY);
  }
  function transformRangeReply(reply) {
    return reply.map(transformSampleReply);
  }
  function transformMRangeReply(reply) {
    const args = [];
    for (const [key, _, sample] of reply) {
      args.push({
        key,
        samples: sample.map(transformSampleReply)
      });
    }
    return args;
  }
  function transformMRangeWithLabelsReply(reply) {
    const args = [];
    for (const [key, labels, samples] of reply) {
      args.push({
        key,
        labels: transformLablesReply(labels),
        samples: samples.map(transformSampleReply)
      });
    }
    return args;
  }
  function pushLatestArgument(args, latest) {
    if (latest) {
      args.push("LATEST");
    }
    return args;
  }
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.pushLatestArgument = exports.transformMRangeWithLabelsReply = exports.transformMRangeReply = exports.transformRangeReply = exports.pushMRangeWithLabelsArguments = exports.pushWithLabelsArgument = exports.pushMRangeArguments = exports.pushFilterArgument = exports.pushMRangeGroupByArguments = exports.pushRangeArguments = exports.TimeSeriesBucketTimestamp = exports.transformSampleReply = exports.transformIncrDecrArguments = exports.pushLabelsArgument = exports.transformLablesReply = exports.pushDuplicatePolicy = exports.pushChunkSizeArgument = exports.pushEncodingArgument = exports.TimeSeriesEncoding = exports.pushRetentionArgument = exports.pushIgnoreArgument = exports.transformTimestampArgument = exports.TimeSeriesReducers = exports.TimeSeriesDuplicatePolicies = exports.TimeSeriesAggregationType = undefined;
  var ADD = require_ADD5();
  var ALTER = require_ALTER2();
  var CREATE = require_CREATE3();
  var CREATERULE = require_CREATERULE();
  var DECRBY = require_DECRBY2();
  var DEL = require_DEL4();
  var DELETERULE = require_DELETERULE();
  var GET = require_GET3();
  var INCRBY = require_INCRBY4();
  var INFO_DEBUG = require_INFO_DEBUG();
  var INFO = require_INFO8();
  var MADD = require_MADD2();
  var MGET = require_MGET3();
  var MGET_WITHLABELS = require_MGET_WITHLABELS();
  var QUERYINDEX = require_QUERYINDEX();
  var RANGE = require_RANGE();
  var REVRANGE = require_REVRANGE();
  var MRANGE = require_MRANGE();
  var MRANGE_WITHLABELS = require_MRANGE_WITHLABELS();
  var MREVRANGE = require_MREVRANGE();
  var MREVRANGE_WITHLABELS = require_MREVRANGE_WITHLABELS();
  var generic_transformers_1 = require_generic_transformers();
  exports.default = {
    ADD,
    add: ADD,
    ALTER,
    alter: ALTER,
    CREATE,
    create: CREATE,
    CREATERULE,
    createRule: CREATERULE,
    DECRBY,
    decrBy: DECRBY,
    DEL,
    del: DEL,
    DELETERULE,
    deleteRule: DELETERULE,
    GET,
    get: GET,
    INCRBY,
    incrBy: INCRBY,
    INFO_DEBUG,
    infoDebug: INFO_DEBUG,
    INFO,
    info: INFO,
    MADD,
    mAdd: MADD,
    MGET,
    mGet: MGET,
    MGET_WITHLABELS,
    mGetWithLabels: MGET_WITHLABELS,
    QUERYINDEX,
    queryIndex: QUERYINDEX,
    RANGE,
    range: RANGE,
    REVRANGE,
    revRange: REVRANGE,
    MRANGE,
    mRange: MRANGE,
    MRANGE_WITHLABELS,
    mRangeWithLabels: MRANGE_WITHLABELS,
    MREVRANGE,
    mRevRange: MREVRANGE,
    MREVRANGE_WITHLABELS,
    mRevRangeWithLabels: MREVRANGE_WITHLABELS
  };
  var TimeSeriesAggregationType;
  (function(TimeSeriesAggregationType2) {
    TimeSeriesAggregationType2["AVG"] = "AVG";
    TimeSeriesAggregationType2["AVERAGE"] = "AVG";
    TimeSeriesAggregationType2["FIRST"] = "FIRST";
    TimeSeriesAggregationType2["LAST"] = "LAST";
    TimeSeriesAggregationType2["MIN"] = "MIN";
    TimeSeriesAggregationType2["MINIMUM"] = "MIN";
    TimeSeriesAggregationType2["MAX"] = "MAX";
    TimeSeriesAggregationType2["MAXIMUM"] = "MAX";
    TimeSeriesAggregationType2["SUM"] = "SUM";
    TimeSeriesAggregationType2["RANGE"] = "RANGE";
    TimeSeriesAggregationType2["COUNT"] = "COUNT";
    TimeSeriesAggregationType2["STD_P"] = "STD.P";
    TimeSeriesAggregationType2["STD_S"] = "STD.S";
    TimeSeriesAggregationType2["VAR_P"] = "VAR.P";
    TimeSeriesAggregationType2["VAR_S"] = "VAR.S";
    TimeSeriesAggregationType2["TWA"] = "TWA";
  })(TimeSeriesAggregationType || (exports.TimeSeriesAggregationType = TimeSeriesAggregationType = {}));
  var TimeSeriesDuplicatePolicies;
  (function(TimeSeriesDuplicatePolicies2) {
    TimeSeriesDuplicatePolicies2["BLOCK"] = "BLOCK";
    TimeSeriesDuplicatePolicies2["FIRST"] = "FIRST";
    TimeSeriesDuplicatePolicies2["LAST"] = "LAST";
    TimeSeriesDuplicatePolicies2["MIN"] = "MIN";
    TimeSeriesDuplicatePolicies2["MAX"] = "MAX";
    TimeSeriesDuplicatePolicies2["SUM"] = "SUM";
  })(TimeSeriesDuplicatePolicies || (exports.TimeSeriesDuplicatePolicies = TimeSeriesDuplicatePolicies = {}));
  var TimeSeriesReducers;
  (function(TimeSeriesReducers2) {
    TimeSeriesReducers2["AVG"] = "AVG";
    TimeSeriesReducers2["SUM"] = "SUM";
    TimeSeriesReducers2["MIN"] = "MIN";
    TimeSeriesReducers2["MINIMUM"] = "MIN";
    TimeSeriesReducers2["MAX"] = "MAX";
    TimeSeriesReducers2["MAXIMUM"] = "MAX";
    TimeSeriesReducers2["RANGE"] = "range";
    TimeSeriesReducers2["COUNT"] = "COUNT";
    TimeSeriesReducers2["STD_P"] = "STD.P";
    TimeSeriesReducers2["STD_S"] = "STD.S";
    TimeSeriesReducers2["VAR_P"] = "VAR.P";
    TimeSeriesReducers2["VAR_S"] = "VAR.S";
  })(TimeSeriesReducers || (exports.TimeSeriesReducers = TimeSeriesReducers = {}));
  exports.transformTimestampArgument = transformTimestampArgument;
  exports.pushIgnoreArgument = pushIgnoreArgument;
  exports.pushRetentionArgument = pushRetentionArgument;
  var TimeSeriesEncoding;
  (function(TimeSeriesEncoding2) {
    TimeSeriesEncoding2["COMPRESSED"] = "COMPRESSED";
    TimeSeriesEncoding2["UNCOMPRESSED"] = "UNCOMPRESSED";
  })(TimeSeriesEncoding || (exports.TimeSeriesEncoding = TimeSeriesEncoding = {}));
  exports.pushEncodingArgument = pushEncodingArgument;
  exports.pushChunkSizeArgument = pushChunkSizeArgument;
  exports.pushDuplicatePolicy = pushDuplicatePolicy;
  exports.transformLablesReply = transformLablesReply;
  exports.pushLabelsArgument = pushLabelsArgument;
  exports.transformIncrDecrArguments = transformIncrDecrArguments;
  exports.transformSampleReply = transformSampleReply;
  var TimeSeriesBucketTimestamp;
  (function(TimeSeriesBucketTimestamp2) {
    TimeSeriesBucketTimestamp2["LOW"] = "-";
    TimeSeriesBucketTimestamp2["HIGH"] = "+";
    TimeSeriesBucketTimestamp2["MID"] = "~";
  })(TimeSeriesBucketTimestamp || (exports.TimeSeriesBucketTimestamp = TimeSeriesBucketTimestamp = {}));
  exports.pushRangeArguments = pushRangeArguments;
  exports.pushMRangeGroupByArguments = pushMRangeGroupByArguments;
  exports.pushFilterArgument = pushFilterArgument;
  exports.pushMRangeArguments = pushMRangeArguments;
  exports.pushWithLabelsArgument = pushWithLabelsArgument;
  exports.pushMRangeWithLabelsArguments = pushMRangeWithLabelsArguments;
  exports.transformRangeReply = transformRangeReply;
  exports.transformMRangeReply = transformMRangeReply;
  exports.transformMRangeWithLabelsReply = transformMRangeWithLabelsReply;
  exports.pushLatestArgument = pushLatestArgument;
});

// node_modules/@redis/time-series/dist/index.js
var require_dist6 = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.TimeSeriesBucketTimestamp = exports.TimeSeriesReducers = exports.TimeSeriesAggregationType = exports.TimeSeriesEncoding = exports.TimeSeriesDuplicatePolicies = exports.default = undefined;
  var commands_1 = require_commands7();
  Object.defineProperty(exports, "default", { enumerable: true, get: function() {
    return commands_1.default;
  } });
  var commands_2 = require_commands7();
  Object.defineProperty(exports, "TimeSeriesDuplicatePolicies", { enumerable: true, get: function() {
    return commands_2.TimeSeriesDuplicatePolicies;
  } });
  Object.defineProperty(exports, "TimeSeriesEncoding", { enumerable: true, get: function() {
    return commands_2.TimeSeriesEncoding;
  } });
  Object.defineProperty(exports, "TimeSeriesAggregationType", { enumerable: true, get: function() {
    return commands_2.TimeSeriesAggregationType;
  } });
  Object.defineProperty(exports, "TimeSeriesReducers", { enumerable: true, get: function() {
    return commands_2.TimeSeriesReducers;
  } });
  Object.defineProperty(exports, "TimeSeriesBucketTimestamp", { enumerable: true, get: function() {
    return commands_2.TimeSeriesBucketTimestamp;
  } });
});

// node_modules/redis/dist/index.js
var require_dist7 = __commonJS((exports) => {
  function createClient(options) {
    return (0, client_1.createClient)({
      ...options,
      modules: {
        ...modules,
        ...options?.modules
      }
    });
  }
  function createCluster(options) {
    return (0, client_1.createCluster)({
      ...options,
      modules: {
        ...modules,
        ...options?.modules
      }
    });
  }
  var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  } : function(o, m, k, k2) {
    if (k2 === undefined)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = exports && exports.__exportStar || function(m, exports2) {
    for (var p in m)
      if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
        __createBinding(exports2, m, p);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createCluster = exports.createClient = undefined;
  var client_1 = require_dist();
  var bloom_1 = require_dist2();
  var graph_1 = require_dist3();
  var json_1 = require_dist4();
  var search_1 = require_dist5();
  var time_series_1 = require_dist6();
  __exportStar(require_dist(), exports);
  __exportStar(require_dist2(), exports);
  __exportStar(require_dist3(), exports);
  __exportStar(require_dist4(), exports);
  __exportStar(require_dist5(), exports);
  __exportStar(require_dist6(), exports);
  var modules = {
    ...bloom_1.default,
    graph: graph_1.default,
    json: json_1.default,
    ft: search_1.default,
    ts: time_series_1.default
  };
  exports.createClient = createClient;
  exports.createCluster = createCluster;
});

// node_modules/@prisma/client/runtime/library.js
var require_library = __commonJS((exports, module) => {
  function yo(e) {
    return typeof e == "function" ? e : (t) => t.$extends(e);
  }
  function bo(e) {
    return e;
  }
  function Eo(...e) {
    return (t) => t;
  }
  function M(e, t) {
    let r = new RegExp(`\\x1b\\[${t}m`, "g"), n = `\x1B[${e}m`, i = `\x1B[${t}m`;
    return function(o) {
      return !To.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(r, i + n) : o) + i;
    };
  }
  function Ru(e) {
    let t = { color: Ro[Tu++ % Ro.length], enabled: Jt.enabled(e), namespace: e, log: Jt.log, extend: () => {
    } }, r = (...n) => {
      let { enabled: i, namespace: o, color: s, log: a } = t;
      if (n.length !== 0 && Qt.push([o, ...n]), Qt.length > vu && Qt.shift(), Jt.enabled(o) || i) {
        let l = n.map((c) => typeof c == "string" ? c : Cu(c)), u = `+${Date.now() - Co}ms`;
        Co = Date.now(), globalThis.DEBUG_COLORS ? a(Mr[s](H(o)), ...l, Mr[s](u)) : a(o, ...l, u);
      }
    };
    return new Proxy(r, { get: (n, i) => t[i], set: (n, i, o) => t[i] = o });
  }
  function Cu(e, t = 2) {
    let r = new Set;
    return JSON.stringify(e, (n, i) => {
      if (typeof i == "object" && i !== null) {
        if (r.has(i))
          return "[Circular *]";
        r.add(i);
      } else if (typeof i == "bigint")
        return i.toString();
      return i;
    }, t);
  }
  function So(e = 7500) {
    let t = Qt.map(([r, ...n]) => `${r} ${n.map((i) => typeof i == "string" ? i : JSON.stringify(i)).join(" ")}`).join(`
`);
    return t.length < e ? t : t.slice(-e);
  }
  function Ao() {
    Qt.length = 0;
  }
  function Qn() {
    let e = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
    if (!(e && Io.default.existsSync(e)) && process.arch === "ia32")
      throw new Error('The default query engine type (Node-API, "library") is currently not supported for 32bit Node. Please set `engineType = "binary"` in the "generator" block of your "schema.prisma" file (or use the environment variables "PRISMA_CLIENT_ENGINE_TYPE=binary" and/or "PRISMA_CLI_QUERY_ENGINE_TYPE=binary".)');
  }
  function qr(e, t) {
    let r = t === "url";
    return e.includes("windows") ? r ? "query_engine.dll.node" : `query_engine-${e}.dll.node` : e.includes("darwin") ? r ? `${$r}.dylib.node` : `${$r}-${e}.dylib.node` : r ? `${$r}.so.node` : `${$r}-${e}.so.node`;
  }
  function pe(e) {
    return Object.assign(e, { optional: () => Au(e), and: (t) => j(e, t), or: (t) => Iu(e, t), select: (t) => t === undefined ? Oo(e) : Oo(t, e) });
  }
  function Au(e) {
    return pe({ [_e]: () => ({ match: (t) => {
      let r = {}, n = (i, o) => {
        r[i] = o;
      };
      return t === undefined ? (Ge(e).forEach((i) => n(i, undefined)), { matched: true, selections: r }) : { matched: Ee(e, t, n), selections: r };
    }, getSelectionKeys: () => Ge(e), matcherType: "optional" }) });
  }
  function j(...e) {
    return pe({ [_e]: () => ({ match: (t) => {
      let r = {}, n = (i, o) => {
        r[i] = o;
      };
      return { matched: e.every((i) => Ee(i, t, n)), selections: r };
    }, getSelectionKeys: () => Wt(e, Ge), matcherType: "and" }) });
  }
  function Iu(...e) {
    return pe({ [_e]: () => ({ match: (t) => {
      let r = {}, n = (i, o) => {
        r[i] = o;
      };
      return Wt(e, Ge).forEach((i) => n(i, undefined)), { matched: e.some((i) => Ee(i, t, n)), selections: r };
    }, getSelectionKeys: () => Wt(e, Ge), matcherType: "or" }) });
  }
  function I(e) {
    return { [_e]: () => ({ match: (t) => ({ matched: !!e(t) }) }) };
  }
  function Oo(...e) {
    let t = typeof e[0] == "string" ? e[0] : undefined, r = e.length === 2 ? e[1] : typeof e[0] == "string" ? undefined : e[0];
    return pe({ [_e]: () => ({ match: (n) => {
      let i = { [t ?? Vr]: n };
      return { matched: r === undefined || Ee(r, n, (o, s) => {
        i[o] = s;
      }), selections: i };
    }, getSelectionKeys: () => [t ?? Vr].concat(r === undefined ? [] : Ge(r)) }) });
  }
  function ye(e) {
    return typeof e == "number";
  }
  function je(e) {
    return typeof e == "string";
  }
  function Ve(e) {
    return typeof e == "bigint";
  }
  function mt(e) {
    return new Kn(e, Hn);
  }
  function Br(e, ...t) {
    ku.warn() && console.warn(`${Ou.warn} ${e}`, ...t);
  }
  async function Lo() {
    let e = Gr.default.platform(), t = process.arch;
    if (e === "freebsd") {
      let s = await Qr("freebsd-version");
      if (s && s.trim().length > 0) {
        let l = /^(\d+)\.?/.exec(s);
        if (l)
          return { platform: "freebsd", targetDistro: `freebsd${l[1]}`, arch: t };
      }
    }
    if (e !== "linux")
      return { platform: e, arch: t };
    let r = await Lu(), n = await Uu(), i = Mu({ arch: t, archFromUname: n, familyDistro: r.familyDistro }), { libssl: o } = await $u(i);
    return { platform: "linux", libssl: o, arch: t, archFromUname: n, ...r };
  }
  function Fu(e) {
    let t = /^ID="?([^"\n]*)"?$/im, r = /^ID_LIKE="?([^"\n]*)"?$/im, n = t.exec(e), i = n && n[1] && n[1].toLowerCase() || "", o = r.exec(e), s = o && o[1] && o[1].toLowerCase() || "", a = mt({ id: i, idLike: s }).with({ id: "alpine" }, ({ id: l }) => ({ targetDistro: "musl", familyDistro: l, originalDistro: l })).with({ id: "raspbian" }, ({ id: l }) => ({ targetDistro: "arm", familyDistro: "debian", originalDistro: l })).with({ id: "nixos" }, ({ id: l }) => ({ targetDistro: "nixos", originalDistro: l, familyDistro: "nixos" })).with({ id: "debian" }, { id: "ubuntu" }, ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).with({ id: "rhel" }, { id: "centos" }, { id: "fedora" }, ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).when(({ idLike: l }) => l.includes("debian") || l.includes("ubuntu"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).when(({ idLike: l }) => i === "arch" || l.includes("arch"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "arch", originalDistro: l })).when(({ idLike: l }) => l.includes("centos") || l.includes("fedora") || l.includes("rhel") || l.includes("suse"), ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).otherwise(({ id: l }) => ({ targetDistro: undefined, familyDistro: undefined, originalDistro: l }));
    return te(`Found distro info:
${JSON.stringify(a, null, 2)}`), a;
  }
  async function Lu() {
    let e = "/etc/os-release";
    try {
      let t = await zn.default.readFile(e, { encoding: "utf-8" });
      return Fu(t);
    } catch {
      return { targetDistro: undefined, familyDistro: undefined, originalDistro: undefined };
    }
  }
  function Nu(e) {
    let t = /^OpenSSL\s(\d+\.\d+)\.\d+/.exec(e);
    if (t) {
      let r = `${t[1]}.x`;
      return No(r);
    }
  }
  function ko(e) {
    let t = /libssl\.so\.(\d)(\.\d)?/.exec(e);
    if (t) {
      let r = `${t[1]}${t[2] ?? ".0"}.x`;
      return No(r);
    }
  }
  function No(e) {
    let t = (() => {
      if ($o(e))
        return e;
      let r = e.split(".");
      return r[1] = "0", r.join(".");
    })();
    if (_u.includes(t))
      return t;
  }
  function Mu(e) {
    return mt(e).with({ familyDistro: "musl" }, () => (te('Trying platform-specific paths for "alpine"'), ["/lib"])).with({ familyDistro: "debian" }, ({ archFromUname: t }) => (te('Trying platform-specific paths for "debian" (and "ubuntu")'), [`/usr/lib/${t}-linux-gnu`, `/lib/${t}-linux-gnu`])).with({ familyDistro: "rhel" }, () => (te('Trying platform-specific paths for "rhel"'), ["/lib64", "/usr/lib64"])).otherwise(({ familyDistro: t, arch: r, archFromUname: n }) => (te(`Don't know any platform-specific paths for "${t}" on ${r} (${n})`), []));
  }
  async function $u(e) {
    let t = 'grep -v "libssl.so.0"', r = await Do(e);
    if (r) {
      te(`Found libssl.so file using platform-specific paths: ${r}`);
      let o = ko(r);
      if (te(`The parsed libssl version is: ${o}`), o)
        return { libssl: o, strategy: "libssl-specific-path" };
    }
    te('Falling back to "ldconfig" and other generic paths');
    let n = await Qr(`ldconfig -p | sed "s/.*=>s*//" | sed "s|.*/||" | grep libssl | sort | ${t}`);
    if (n || (n = await Do(["/lib64", "/usr/lib64", "/lib"])), n) {
      te(`Found libssl.so file using "ldconfig" or other generic paths: ${n}`);
      let o = ko(n);
      if (te(`The parsed libssl version is: ${o}`), o)
        return { libssl: o, strategy: "ldconfig" };
    }
    let i = await Qr("openssl version -v");
    if (i) {
      te(`Found openssl binary with version: ${i}`);
      let o = Nu(i);
      if (te(`The parsed openssl version is: ${o}`), o)
        return { libssl: o, strategy: "openssl-binary" };
    }
    return te("Couldn't find any version of libssl or OpenSSL in the system"), {};
  }
  async function Do(e) {
    for (let t of e) {
      let r = await qu(t);
      if (r)
        return r;
    }
  }
  async function qu(e) {
    try {
      return (await zn.default.readdir(e)).find((r) => r.startsWith("libssl.so.") && !r.startsWith("libssl.so.0"));
    } catch (t) {
      if (t.code === "ENOENT")
        return;
      throw t;
    }
  }
  async function nt() {
    let { binaryTarget: e } = await Mo();
    return e;
  }
  function ju(e) {
    return e.binaryTarget !== undefined;
  }
  async function Yn() {
    let { memoized: e, ...t } = await Mo();
    return t;
  }
  async function Mo() {
    if (ju(Ur))
      return Promise.resolve({ ...Ur, memoized: true });
    let e = await Lo(), t = Vu(e);
    return Ur = { ...e, binaryTarget: t }, { ...Ur, memoized: false };
  }
  function Vu(e) {
    let { platform: t, arch: r, archFromUname: n, libssl: i, targetDistro: o, familyDistro: s, originalDistro: a } = e;
    t === "linux" && !["x64", "arm64"].includes(r) && Br(`Prisma only officially supports Linux on amd64 (x86_64) and arm64 (aarch64) system architectures (detected "${r}" instead). If you are using your own custom Prisma engines, you can ignore this warning, as long as you've compiled the engines for your system architecture "${n}".`);
    let l = "1.1.x";
    if (t === "linux" && i === undefined) {
      let c = mt({ familyDistro: s }).with({ familyDistro: "debian" }, () => "Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.").otherwise(() => "Please manually install OpenSSL and try installing Prisma again.");
      Br(`Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-${l}".
${c}`);
    }
    let u = "debian";
    if (t === "linux" && o === undefined && te(`Distro is "${a}". Falling back to Prisma engines built for "${u}".`), t === "darwin" && r === "arm64")
      return "darwin-arm64";
    if (t === "darwin")
      return "darwin";
    if (t === "win32")
      return "windows";
    if (t === "freebsd")
      return o;
    if (t === "openbsd")
      return "openbsd";
    if (t === "netbsd")
      return "netbsd";
    if (t === "linux" && o === "nixos")
      return "linux-nixos";
    if (t === "linux" && r === "arm64")
      return `${o === "musl" ? "linux-musl-arm64" : "linux-arm64"}-openssl-${i || l}`;
    if (t === "linux" && r === "arm")
      return `linux-arm-openssl-${i || l}`;
    if (t === "linux" && o === "musl") {
      let c = "linux-musl";
      return !i || $o(i) ? c : `${c}-openssl-${i}`;
    }
    return t === "linux" && o && i ? `${o}-openssl-${i}` : (t !== "linux" && Br(`Prisma detected unknown OS "${t}" and may not work as expected. Defaulting to "linux".`), i ? `${u}-openssl-${i}` : o ? `${o}-openssl-${l}` : `${u}-openssl-${l}`);
  }
  async function Bu(e) {
    try {
      return await e();
    } catch {
      return;
    }
  }
  function Qr(e) {
    return Bu(async () => {
      let t = await Du(e);
      return te(`Command "${e}" successfully returned "${t.stdout}"`), t.stdout;
    });
  }
  async function Uu() {
    return typeof Gr.default.machine == "function" ? Gr.default.machine() : (await Qr("uname -m"))?.trim();
  }
  function $o(e) {
    return e.startsWith("1.");
  }
  function ii(e) {
    return (0, zo.default)(e, e, { fallback: X });
  }
  function Yo() {
    return $.default.join(__dirname, "../");
  }
  function li(e) {
    if (process.platform === "win32")
      return;
    let t = ai.default.statSync(e), r = t.mode | 64 | 8 | 1;
    if (t.mode === r) {
      Zo(`Execution permissions of ${e} are fine`);
      return;
    }
    let n = r.toString(8).slice(-3);
    Zo(`Have to call chmodPlusX on ${e}`), ai.default.chmodSync(e, n);
  }
  function ui(e) {
    let t = e.e, r = (a) => `Prisma cannot find the required \`${a}\` system library in your system`, n = t.message.includes("cannot open shared object file"), i = `Please refer to the documentation about Prisma's system requirements: ${ii("https://pris.ly/d/system-requirements")}`, o = `Unable to require(\`${Oe(e.id)}\`).`, s = mt({ message: t.message, code: t.code }).with({ code: "ENOENT" }, () => "File does not exist.").when(({ message: a }) => n && a.includes("libz"), () => `${r("libz")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libgcc_s"), () => `${r("libgcc_s")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libssl"), () => {
      let a = e.platformInfo.libssl ? `openssl-${e.platformInfo.libssl}` : "openssl";
      return `${r("libssl")}. Please install ${a} and try again.`;
    }).when(({ message: a }) => a.includes("GLIBC"), () => `Prisma has detected an incompatible version of the \`glibc\` C standard library installed in your system. This probably means your system may be too old to run Prisma. ${i}`).when(({ message: a }) => e.platformInfo.platform === "linux" && a.includes("symbol not found"), () => `The Prisma engines are not compatible with your system ${e.platformInfo.originalDistro} on (${e.platformInfo.archFromUname}) which uses the \`${e.platformInfo.binaryTarget}\` binaryTarget by default. ${i}`).otherwise(() => `The Prisma engines do not seem to be compatible with your system. ${i}`);
    return `${o}
${s}

Details: ${t.message}`;
  }
  function rs(e) {
    let t = e.ignoreProcessEnv ? {} : process.env, r = (n) => n.match(/(.?\${(?:[a-zA-Z0-9_]+)?})/g)?.reduce(function(o, s) {
      let a = /(.?)\${([a-zA-Z0-9_]+)?}/g.exec(s);
      if (!a)
        return o;
      let l = a[1], u, c;
      if (l === "\\")
        c = a[0], u = c.replace("\\$", "$");
      else {
        let p = a[2];
        c = a[0].substring(l.length), u = Object.hasOwnProperty.call(t, p) ? t[p] : e.parsed[p] || "", u = r(u);
      }
      return o.replace(c, u);
    }, n) ?? n;
    for (let n in e.parsed) {
      let i = Object.hasOwnProperty.call(t, n) ? t[n] : e.parsed[n];
      e.parsed[n] = r(i);
    }
    for (let n in e.parsed)
      t[n] = e.parsed[n];
    return e;
  }
  function zt({ rootEnvPath: e, schemaEnvPath: t }, r = { conflictCheck: "none" }) {
    let n = ns(e);
    r.conflictCheck !== "none" && sc(n, t, r.conflictCheck);
    let i = null;
    return is(n?.path, t) || (i = ns(t)), !n && !i && pi("No Environment variables loaded"), i?.dotenvResult.error ? console.error(ce(H("Schema Env Error: ")) + i.dotenvResult.error) : { message: [n?.message, i?.message].filter(Boolean).join(`
`), parsed: { ...n?.dotenvResult?.parsed, ...i?.dotenvResult?.parsed } };
  }
  function sc(e, t, r) {
    let n = e?.dotenvResult.parsed, i = !is(e?.path, t);
    if (n && t && i && zr.default.existsSync(t)) {
      let o = di.default.parse(zr.default.readFileSync(t)), s = [];
      for (let a in o)
        n[a] === o[a] && s.push(a);
      if (s.length > 0) {
        let a = ht.default.relative(process.cwd(), e.path), l = ht.default.relative(process.cwd(), t);
        if (r === "error") {
          let u = `There is a conflict between env var${s.length > 1 ? "s" : ""} in ${X(a)} and ${X(l)}
Conflicting env vars:
${s.map((c) => `  ${H(c)}`).join(`
`)}

We suggest to move the contents of ${X(l)} to ${X(a)} to consolidate your env vars.
`;
          throw new Error(u);
        } else if (r === "warn") {
          let u = `Conflict for env var${s.length > 1 ? "s" : ""} ${s.map((c) => H(c)).join(", ")} in ${X(a)} and ${X(l)}
Env vars from ${X(l)} overwrite the ones from ${X(a)}
      `;
          console.warn(`${ke("warn(prisma)")} ${u}`);
        }
      }
    }
  }
  function ns(e) {
    if (ac(e)) {
      pi(`Environment variables loaded from ${e}`);
      let t = di.default.config({ path: e, debug: process.env.DOTENV_CONFIG_DEBUG ? true : undefined });
      return { dotenvResult: rs(t), message: Oe(`Environment variables loaded from ${ht.default.relative(process.cwd(), e)}`), path: e };
    } else
      pi(`Environment variables not found at ${e}`);
    return null;
  }
  function is(e, t) {
    return e && t && ht.default.resolve(e) === ht.default.resolve(t);
  }
  function ac(e) {
    return !!(e && zr.default.existsSync(e));
  }
  function Yt(e) {
    let t = lc();
    return t || (e?.config.engineType === "library" ? "library" : e?.config.engineType === "binary" ? "binary" : os);
  }
  function lc() {
    let e = process.env.PRISMA_CLIENT_ENGINE_TYPE;
    return e === "library" ? "library" : e === "binary" ? "binary" : undefined;
  }
  function mi(e) {
    return Zt.default.sep === Zt.default.posix.sep ? e : e.split(Zt.default.sep).join(Zt.default.posix.sep);
  }
  function hi(e) {
    return String(new gi(e));
  }
  function cc(e) {
    let t;
    if (e.length > 0) {
      let r = e.find((n) => n.fromEnvVar !== null);
      r ? t = `env("${r.fromEnvVar}")` : t = e.map((n) => n.native ? "native" : n.value);
    } else
      t = undefined;
    return t;
  }
  function pc(e) {
    let t = Object.keys(e).reduce((r, n) => Math.max(r, n.length), 0);
    return Object.entries(e).map(([r, n]) => `${r.padEnd(t)} = ${dc(n)}`).join(`
`);
  }
  function dc(e) {
    return JSON.parse(JSON.stringify(e, (t, r) => Array.isArray(r) ? `[${r.map((n) => JSON.stringify(n)).join(", ")}]` : JSON.stringify(r)));
  }
  function mc(...e) {
    console.log(...e);
  }
  function yi(e, ...t) {
    ds.warn() && console.warn(`${Xt.warn} ${e}`, ...t);
  }
  function fc(e, ...t) {
    console.info(`${Xt.info} ${e}`, ...t);
  }
  function gc(e, ...t) {
    console.error(`${Xt.error} ${e}`, ...t);
  }
  function hc(e, ...t) {
    console.log(`${Xt.query} ${e}`, ...t);
  }
  function Yr(e, t) {
    if (!e)
      throw new Error(`${t}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
  }
  function Fe(e, t) {
    throw new Error(t);
  }
  function Ei(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  function yt(e, t) {
    let r = {};
    for (let n of Object.keys(e))
      r[n] = t(e[n], n);
    return r;
  }
  function xi(e, t) {
    if (e.length === 0)
      return;
    let r = e[0];
    for (let n = 1;n < e.length; n++)
      t(r, e[n]) < 0 && (r = e[n]);
    return r;
  }
  function w(e, t) {
    Object.defineProperty(e, "name", { value: t, configurable: true });
  }
  function K(e) {
    var t, r, n, i = e.length - 1, o = "", s = e[0];
    if (i > 0) {
      for (o += s, t = 1;t < i; t++)
        n = e[t] + "", r = b - n.length, r && (o += We(r)), o += n;
      s = e[t], n = s + "", r = b - n.length, r && (o += We(r));
    } else if (s === 0)
      return "0";
    for (;s % 10 === 0; )
      s /= 10;
    return o + s;
  }
  function ie(e, t, r) {
    if (e !== ~~e || e < t || e > r)
      throw Error(Ke + e);
  }
  function rr(e, t, r, n) {
    var i, o, s, a;
    for (o = e[0];o >= 10; o /= 10)
      --t;
    return --t < 0 ? (t += b, i = 0) : (i = Math.ceil((t + 1) / b), t %= b), o = G(10, b - t), a = e[i] % o | 0, n == null ? t < 3 ? (t == 0 ? a = a / 100 | 0 : t == 1 && (a = a / 10 | 0), s = r < 4 && a == 99999 || r > 3 && a == 49999 || a == 50000 || a == 0) : s = (r < 4 && a + 1 == o || r > 3 && a + 1 == o / 2) && (e[i + 1] / o / 100 | 0) == G(10, t - 2) - 1 || (a == o / 2 || a == 0) && (e[i + 1] / o / 100 | 0) == 0 : t < 4 ? (t == 0 ? a = a / 1000 | 0 : t == 1 ? a = a / 100 | 0 : t == 2 && (a = a / 10 | 0), s = (n || r < 4) && a == 9999 || !n && r > 3 && a == 4999) : s = ((n || r < 4) && a + 1 == o || !n && r > 3 && a + 1 == o / 2) && (e[i + 1] / o / 1000 | 0) == G(10, t - 3) - 1, s;
  }
  function en(e, t, r) {
    for (var n, i = [0], o, s = 0, a = e.length;s < a; ) {
      for (o = i.length;o--; )
        i[o] *= t;
      for (i[0] += Pi.indexOf(e.charAt(s++)), n = 0;n < i.length; n++)
        i[n] > r - 1 && (i[n + 1] === undefined && (i[n + 1] = 0), i[n + 1] += i[n] / r | 0, i[n] %= r);
    }
    return i.reverse();
  }
  function vc(e, t) {
    var r, n, i;
    if (t.isZero())
      return t;
    n = t.d.length, n < 32 ? (r = Math.ceil(n / 3), i = (1 / an(4, r)).toString()) : (r = 16, i = "2.3283064365386962890625e-10"), e.precision += r, t = Et(e, 1, t.times(i), new e(1));
    for (var o = r;o--; ) {
      var s = t.times(t);
      t = s.times(s).minus(s).times(8).plus(1);
    }
    return e.precision -= r, t;
  }
  function y(e, t, r, n) {
    var i, o, s, a, l, u, c, p, d, f = e.constructor;
    e:
      if (t != null) {
        if (p = e.d, !p)
          return e;
        for (i = 1, a = p[0];a >= 10; a /= 10)
          i++;
        if (o = t - i, o < 0)
          o += b, s = t, c = p[d = 0], l = c / G(10, i - s - 1) % 10 | 0;
        else if (d = Math.ceil((o + 1) / b), a = p.length, d >= a)
          if (n) {
            for (;a++ <= d; )
              p.push(0);
            c = l = 0, i = 1, o %= b, s = o - b + 1;
          } else
            break e;
        else {
          for (c = a = p[d], i = 1;a >= 10; a /= 10)
            i++;
          o %= b, s = o - b + i, l = s < 0 ? 0 : c / G(10, i - s - 1) % 10 | 0;
        }
        if (n = n || t < 0 || p[d + 1] !== undefined || (s < 0 ? c : c % G(10, i - s - 1)), u = r < 4 ? (l || n) && (r == 0 || r == (e.s < 0 ? 3 : 2)) : l > 5 || l == 5 && (r == 4 || n || r == 6 && (o > 0 ? s > 0 ? c / G(10, i - s) : 0 : p[d - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7)), t < 1 || !p[0])
          return p.length = 0, u ? (t -= e.e + 1, p[0] = G(10, (b - t % b) % b), e.e = -t || 0) : p[0] = e.e = 0, e;
        if (o == 0 ? (p.length = d, a = 1, d--) : (p.length = d + 1, a = G(10, b - o), p[d] = s > 0 ? (c / G(10, i - s) % G(10, s) | 0) * a : 0), u)
          for (;; )
            if (d == 0) {
              for (o = 1, s = p[0];s >= 10; s /= 10)
                o++;
              for (s = p[0] += a, a = 1;s >= 10; s /= 10)
                a++;
              o != a && (e.e++, p[0] == ge && (p[0] = 1));
              break;
            } else {
              if (p[d] += a, p[d] != ge)
                break;
              p[d--] = 0, a = 1;
            }
        for (o = p.length;p[--o] === 0; )
          p.pop();
      }
    return x && (e.e > f.maxE ? (e.d = null, e.e = NaN) : e.e < f.minE && (e.e = 0, e.d = [0])), e;
  }
  function we(e, t, r) {
    if (!e.isFinite())
      return Is(e);
    var n, i = e.e, o = K(e.d), s = o.length;
    return t ? (r && (n = r - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + We(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (e.e < 0 ? "e" : "e+") + e.e) : i < 0 ? (o = "0." + We(-i - 1) + o, r && (n = r - s) > 0 && (o += We(n))) : i >= s ? (o += We(i + 1 - s), r && (n = r - i - 1) > 0 && (o = o + "." + We(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), r && (n = r - s) > 0 && (i + 1 === s && (o += "."), o += We(n))), o;
  }
  function sn(e, t) {
    var r = e[0];
    for (t *= b;r >= 10; r /= 10)
      t++;
    return t;
  }
  function nn(e, t, r) {
    if (t > Pc)
      throw x = true, r && (e.precision = r), Error(Ps);
    return y(new e(tn), t, 1, true);
  }
  function fe(e, t, r) {
    if (t > Ti)
      throw Error(Ps);
    return y(new e(rn), t, r, true);
  }
  function Cs(e) {
    var t = e.length - 1, r = t * b + 1;
    if (t = e[t], t) {
      for (;t % 10 == 0; t /= 10)
        r--;
      for (t = e[0];t >= 10; t /= 10)
        r++;
    }
    return r;
  }
  function We(e) {
    for (var t = "";e--; )
      t += "0";
    return t;
  }
  function Ss(e, t, r, n) {
    var i, o = new e(1), s = Math.ceil(n / b + 4);
    for (x = false;; ) {
      if (r % 2 && (o = o.times(t), Es(o.d, s) && (i = true)), r = ee(r / 2), r === 0) {
        r = o.d.length - 1, i && o.d[r] === 0 && ++o.d[r];
        break;
      }
      t = t.times(t), Es(t.d, s);
    }
    return x = true, o;
  }
  function bs(e) {
    return e.d[e.d.length - 1] & 1;
  }
  function As(e, t, r) {
    for (var n, i = new e(t[0]), o = 0;++o < t.length; )
      if (n = new e(t[o]), n.s)
        i[r](n) && (i = n);
      else {
        i = n;
        break;
      }
    return i;
  }
  function Ri(e, t) {
    var r, n, i, o, s, a, l, u = 0, c = 0, p = 0, d = e.constructor, f = d.rounding, g = d.precision;
    if (!e.d || !e.d[0] || e.e > 17)
      return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
    for (t == null ? (x = false, l = g) : l = t, a = new d(0.03125);e.e > -2; )
      e = e.times(a), p += 5;
    for (n = Math.log(G(2, p)) / Math.LN10 * 2 + 5 | 0, l += n, r = o = s = new d(1), d.precision = l;; ) {
      if (o = y(o.times(e), l, 1), r = r.times(++c), a = s.plus(N(o, r, l, 1)), K(a.d).slice(0, l) === K(s.d).slice(0, l)) {
        for (i = p;i--; )
          s = y(s.times(s), l, 1);
        if (t == null)
          if (u < 3 && rr(s.d, l - n, f, u))
            d.precision = l += 10, r = o = a = new d(1), c = 0, u++;
          else
            return y(s, d.precision = g, f, x = true);
        else
          return d.precision = g, s;
      }
      s = a;
    }
  }
  function He(e, t) {
    var r, n, i, o, s, a, l, u, c, p, d, f = 1, g = 10, h = e, O = h.d, T = h.constructor, S = T.rounding, C = T.precision;
    if (h.s < 0 || !O || !O[0] || !h.e && O[0] == 1 && O.length == 1)
      return new T(O && !O[0] ? -1 / 0 : h.s != 1 ? NaN : O ? 0 : h);
    if (t == null ? (x = false, c = C) : c = t, T.precision = c += g, r = K(O), n = r.charAt(0), Math.abs(o = h.e) < 1500000000000000) {
      for (;n < 7 && n != 1 || n == 1 && r.charAt(1) > 3; )
        h = h.times(e), r = K(h.d), n = r.charAt(0), f++;
      o = h.e, n > 1 ? (h = new T("0." + r), o++) : h = new T(n + "." + r.slice(1));
    } else
      return u = nn(T, c + 2, C).times(o + ""), h = He(new T(n + "." + r.slice(1)), c - g).plus(u), T.precision = C, t == null ? y(h, C, S, x = true) : h;
    for (p = h, l = s = h = N(h.minus(1), h.plus(1), c, 1), d = y(h.times(h), c, 1), i = 3;; ) {
      if (s = y(s.times(d), c, 1), u = l.plus(N(s, new T(i), c, 1)), K(u.d).slice(0, c) === K(l.d).slice(0, c))
        if (l = l.times(2), o !== 0 && (l = l.plus(nn(T, c + 2, C).times(o + ""))), l = N(l, new T(f), c, 1), t == null)
          if (rr(l.d, c - g, S, a))
            T.precision = c += g, u = s = h = N(p.minus(1), p.plus(1), c, 1), d = y(h.times(h), c, 1), i = a = 1;
          else
            return y(l, T.precision = C, S, x = true);
        else
          return T.precision = C, l;
      l = u, i += 2;
    }
  }
  function Is(e) {
    return String(e.s * e.s / 0);
  }
  function Ci(e, t) {
    var r, n, i;
    for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0;t.charCodeAt(n) === 48; n++)
      ;
    for (i = t.length;t.charCodeAt(i - 1) === 48; --i)
      ;
    if (t = t.slice(n, i), t) {
      if (i -= n, e.e = r = r - n - 1, e.d = [], n = (r + 1) % b, r < 0 && (n += b), n < i) {
        for (n && e.d.push(+t.slice(0, n)), i -= b;n < i; )
          e.d.push(+t.slice(n, n += b));
        t = t.slice(n), n = b - t.length;
      } else
        n -= i;
      for (;n--; )
        t += "0";
      e.d.push(+t), x && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [0]));
    } else
      e.e = 0, e.d = [0];
    return e;
  }
  function Tc(e, t) {
    var r, n, i, o, s, a, l, u, c;
    if (t.indexOf("_") > -1) {
      if (t = t.replace(/(\d)_(?=\d)/g, "$1"), Rs.test(t))
        return Ci(e, t);
    } else if (t === "Infinity" || t === "NaN")
      return +t || (e.s = NaN), e.e = NaN, e.d = null, e;
    if (Ec.test(t))
      r = 16, t = t.toLowerCase();
    else if (bc.test(t))
      r = 2;
    else if (wc.test(t))
      r = 8;
    else
      throw Error(Ke + t);
    for (o = t.search(/p/i), o > 0 ? (l = +t.slice(o + 1), t = t.substring(2, o)) : t = t.slice(2), o = t.indexOf("."), s = o >= 0, n = e.constructor, s && (t = t.replace(".", ""), a = t.length, o = a - o, i = Ss(n, new n(r), o, o * 2)), u = en(t, r, ge), c = u.length - 1, o = c;u[o] === 0; --o)
      u.pop();
    return o < 0 ? new n(e.s * 0) : (e.e = sn(u, c), e.d = u, x = false, s && (e = N(e, i, a * 4)), l && (e = e.times(Math.abs(l) < 54 ? G(2, l) : it.pow(2, l))), x = true, e);
  }
  function Rc(e, t) {
    var r, n = t.d.length;
    if (n < 3)
      return t.isZero() ? t : Et(e, 2, t, t);
    r = 1.4 * Math.sqrt(n), r = r > 16 ? 16 : r | 0, t = t.times(1 / an(5, r)), t = Et(e, 2, t, t);
    for (var i, o = new e(5), s = new e(16), a = new e(20);r--; )
      i = t.times(t), t = t.times(o.plus(i.times(s.times(i).minus(a))));
    return t;
  }
  function Et(e, t, r, n, i) {
    var o, s, a, l, u = 1, c = e.precision, p = Math.ceil(c / b);
    for (x = false, l = r.times(r), a = new e(n);; ) {
      if (s = N(a.times(l), new e(t++ * t++), c, 1), a = i ? n.plus(s) : n.minus(s), n = N(s.times(l), new e(t++ * t++), c, 1), s = a.plus(n), s.d[p] !== undefined) {
        for (o = p;s.d[o] === a.d[o] && o--; )
          ;
        if (o == -1)
          break;
      }
      o = a, a = n, n = s, s = o, u++;
    }
    return x = true, s.d.length = p + 1, s;
  }
  function an(e, t) {
    for (var r = e;--t; )
      r *= e;
    return r;
  }
  function Os(e, t) {
    var r, n = t.s < 0, i = fe(e, e.precision, 1), o = i.times(0.5);
    if (t = t.abs(), t.lte(o))
      return Ne = n ? 4 : 1, t;
    if (r = t.divToInt(i), r.isZero())
      Ne = n ? 3 : 2;
    else {
      if (t = t.minus(r.times(i)), t.lte(o))
        return Ne = bs(r) ? n ? 2 : 3 : n ? 4 : 1, t;
      Ne = bs(r) ? n ? 1 : 4 : n ? 3 : 2;
    }
    return t.minus(i).abs();
  }
  function Si(e, t, r, n) {
    var i, o, s, a, l, u, c, p, d, f = e.constructor, g = r !== undefined;
    if (g ? (ie(r, 1, ze), n === undefined ? n = f.rounding : ie(n, 0, 8)) : (r = f.precision, n = f.rounding), !e.isFinite())
      c = Is(e);
    else {
      for (c = we(e), s = c.indexOf("."), g ? (i = 2, t == 16 ? r = r * 4 - 3 : t == 8 && (r = r * 3 - 2)) : i = t, s >= 0 && (c = c.replace(".", ""), d = new f(1), d.e = c.length - s, d.d = en(we(d), 10, i), d.e = d.d.length), p = en(c, 10, i), o = l = p.length;p[--l] == 0; )
        p.pop();
      if (!p[0])
        c = g ? "0p+0" : "0";
      else {
        if (s < 0 ? o-- : (e = new f(e), e.d = p, e.e = o, e = N(e, d, r, n, 0, i), p = e.d, o = e.e, u = xs), s = p[r], a = i / 2, u = u || p[r + 1] !== undefined, u = n < 4 ? (s !== undefined || u) && (n === 0 || n === (e.s < 0 ? 3 : 2)) : s > a || s === a && (n === 4 || u || n === 6 && p[r - 1] & 1 || n === (e.s < 0 ? 8 : 7)), p.length = r, u)
          for (;++p[--r] > i - 1; )
            p[r] = 0, r || (++o, p.unshift(1));
        for (l = p.length;!p[l - 1]; --l)
          ;
        for (s = 0, c = "";s < l; s++)
          c += Pi.charAt(p[s]);
        if (g) {
          if (l > 1)
            if (t == 16 || t == 8) {
              for (s = t == 16 ? 4 : 3, --l;l % s; l++)
                c += "0";
              for (p = en(c, i, t), l = p.length;!p[l - 1]; --l)
                ;
              for (s = 1, c = "1.";s < l; s++)
                c += Pi.charAt(p[s]);
            } else
              c = c.charAt(0) + "." + c.slice(1);
          c = c + (o < 0 ? "p" : "p+") + o;
        } else if (o < 0) {
          for (;++o; )
            c = "0" + c;
          c = "0." + c;
        } else if (++o > l)
          for (o -= l;o--; )
            c += "0";
        else
          o < l && (c = c.slice(0, o) + "." + c.slice(o));
      }
      c = (t == 16 ? "0x" : t == 2 ? "0b" : t == 8 ? "0o" : "") + c;
    }
    return e.s < 0 ? "-" + c : c;
  }
  function Es(e, t) {
    if (e.length > t)
      return e.length = t, true;
  }
  function Cc(e) {
    return new this(e).abs();
  }
  function Sc(e) {
    return new this(e).acos();
  }
  function Ac(e) {
    return new this(e).acosh();
  }
  function Ic(e, t) {
    return new this(e).plus(t);
  }
  function Oc(e) {
    return new this(e).asin();
  }
  function kc(e) {
    return new this(e).asinh();
  }
  function Dc(e) {
    return new this(e).atan();
  }
  function _c(e) {
    return new this(e).atanh();
  }
  function Fc(e, t) {
    e = new this(e), t = new this(t);
    var r, n = this.precision, i = this.rounding, o = n + 4;
    return !e.s || !t.s ? r = new this(NaN) : !e.d && !t.d ? (r = fe(this, o, 1).times(t.s > 0 ? 0.25 : 0.75), r.s = e.s) : !t.d || e.isZero() ? (r = t.s < 0 ? fe(this, n, i) : new this(0), r.s = e.s) : !e.d || t.isZero() ? (r = fe(this, o, 1).times(0.5), r.s = e.s) : t.s < 0 ? (this.precision = o, this.rounding = 1, r = this.atan(N(e, t, o, 1)), t = fe(this, o, 1), this.precision = n, this.rounding = i, r = e.s < 0 ? r.minus(t) : r.plus(t)) : r = this.atan(N(e, t, o, 1)), r;
  }
  function Lc(e) {
    return new this(e).cbrt();
  }
  function Nc(e) {
    return y(e = new this(e), e.e + 1, 2);
  }
  function Mc(e, t, r) {
    return new this(e).clamp(t, r);
  }
  function $c(e) {
    if (!e || typeof e != "object")
      throw Error(on + "Object expected");
    var t, r, n, i = e.defaults === true, o = ["precision", 1, ze, "rounding", 0, 8, "toExpNeg", -bt, 0, "toExpPos", 0, bt, "maxE", 0, bt, "minE", -bt, 0, "modulo", 0, 9];
    for (t = 0;t < o.length; t += 3)
      if (r = o[t], i && (this[r] = vi[r]), (n = e[r]) !== undefined)
        if (ee(n) === n && n >= o[t + 1] && n <= o[t + 2])
          this[r] = n;
        else
          throw Error(Ke + r + ": " + n);
    if (r = "crypto", i && (this[r] = vi[r]), (n = e[r]) !== undefined)
      if (n === true || n === false || n === 0 || n === 1)
        if (n)
          if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes))
            this[r] = true;
          else
            throw Error(vs);
        else
          this[r] = false;
      else
        throw Error(Ke + r + ": " + n);
    return this;
  }
  function qc(e) {
    return new this(e).cos();
  }
  function jc(e) {
    return new this(e).cosh();
  }
  function ks(e) {
    var t, r, n;
    function i(o) {
      var s, a, l, u = this;
      if (!(u instanceof i))
        return new i(o);
      if (u.constructor = i, ws(o)) {
        u.s = o.s, x ? !o.d || o.e > i.maxE ? (u.e = NaN, u.d = null) : o.e < i.minE ? (u.e = 0, u.d = [0]) : (u.e = o.e, u.d = o.d.slice()) : (u.e = o.e, u.d = o.d ? o.d.slice() : o.d);
        return;
      }
      if (l = typeof o, l === "number") {
        if (o === 0) {
          u.s = 1 / o < 0 ? -1 : 1, u.e = 0, u.d = [0];
          return;
        }
        if (o < 0 ? (o = -o, u.s = -1) : u.s = 1, o === ~~o && o < 1e7) {
          for (s = 0, a = o;a >= 10; a /= 10)
            s++;
          x ? s > i.maxE ? (u.e = NaN, u.d = null) : s < i.minE ? (u.e = 0, u.d = [0]) : (u.e = s, u.d = [o]) : (u.e = s, u.d = [o]);
          return;
        } else if (o * 0 !== 0) {
          o || (u.s = NaN), u.e = NaN, u.d = null;
          return;
        }
        return Ci(u, o.toString());
      } else if (l !== "string")
        throw Error(Ke + o);
      return (a = o.charCodeAt(0)) === 45 ? (o = o.slice(1), u.s = -1) : (a === 43 && (o = o.slice(1)), u.s = 1), Rs.test(o) ? Ci(u, o) : Tc(u, o);
    }
    if (i.prototype = m, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.EUCLID = 9, i.config = i.set = $c, i.clone = ks, i.isDecimal = ws, i.abs = Cc, i.acos = Sc, i.acosh = Ac, i.add = Ic, i.asin = Oc, i.asinh = kc, i.atan = Dc, i.atanh = _c, i.atan2 = Fc, i.cbrt = Lc, i.ceil = Nc, i.clamp = Mc, i.cos = qc, i.cosh = jc, i.div = Vc, i.exp = Bc, i.floor = Uc, i.hypot = Gc, i.ln = Qc, i.log = Jc, i.log10 = Hc, i.log2 = Wc, i.max = Kc, i.min = zc, i.mod = Yc, i.mul = Zc, i.pow = Xc, i.random = ep, i.round = tp, i.sign = rp, i.sin = np, i.sinh = ip, i.sqrt = op, i.sub = sp, i.sum = ap, i.tan = lp, i.tanh = up, i.trunc = cp, e === undefined && (e = {}), e && e.defaults !== true)
      for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], t = 0;t < n.length; )
        e.hasOwnProperty(r = n[t++]) || (e[r] = this[r]);
    return i.config(e), i;
  }
  function Vc(e, t) {
    return new this(e).div(t);
  }
  function Bc(e) {
    return new this(e).exp();
  }
  function Uc(e) {
    return y(e = new this(e), e.e + 1, 3);
  }
  function Gc() {
    var e, t, r = new this(0);
    for (x = false, e = 0;e < arguments.length; )
      if (t = new this(arguments[e++]), t.d)
        r.d && (r = r.plus(t.times(t)));
      else {
        if (t.s)
          return x = true, new this(1 / 0);
        r = t;
      }
    return x = true, r.sqrt();
  }
  function ws(e) {
    return e instanceof it || e && e.toStringTag === Ts || false;
  }
  function Qc(e) {
    return new this(e).ln();
  }
  function Jc(e, t) {
    return new this(e).log(t);
  }
  function Wc(e) {
    return new this(e).log(2);
  }
  function Hc(e) {
    return new this(e).log(10);
  }
  function Kc() {
    return As(this, arguments, "lt");
  }
  function zc() {
    return As(this, arguments, "gt");
  }
  function Yc(e, t) {
    return new this(e).mod(t);
  }
  function Zc(e, t) {
    return new this(e).mul(t);
  }
  function Xc(e, t) {
    return new this(e).pow(t);
  }
  function ep(e) {
    var t, r, n, i, o = 0, s = new this(1), a = [];
    if (e === undefined ? e = this.precision : ie(e, 1, ze), n = Math.ceil(e / b), this.crypto)
      if (crypto.getRandomValues)
        for (t = crypto.getRandomValues(new Uint32Array(n));o < n; )
          i = t[o], i >= 4290000000 ? t[o] = crypto.getRandomValues(new Uint32Array(1))[0] : a[o++] = i % 1e7;
      else if (crypto.randomBytes) {
        for (t = crypto.randomBytes(n *= 4);o < n; )
          i = t[o] + (t[o + 1] << 8) + (t[o + 2] << 16) + ((t[o + 3] & 127) << 24), i >= 2140000000 ? crypto.randomBytes(4).copy(t, o) : (a.push(i % 1e7), o += 4);
        o = n / 4;
      } else
        throw Error(vs);
    else
      for (;o < n; )
        a[o++] = Math.random() * 1e7 | 0;
    for (n = a[--o], e %= b, n && e && (i = G(10, b - e), a[o] = (n / i | 0) * i);a[o] === 0; o--)
      a.pop();
    if (o < 0)
      r = 0, a = [0];
    else {
      for (r = -1;a[0] === 0; r -= b)
        a.shift();
      for (n = 1, i = a[0];i >= 10; i /= 10)
        n++;
      n < b && (r -= b - n);
    }
    return s.e = r, s.d = a, s;
  }
  function tp(e) {
    return y(e = new this(e), e.e + 1, this.rounding);
  }
  function rp(e) {
    return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
  }
  function np(e) {
    return new this(e).sin();
  }
  function ip(e) {
    return new this(e).sinh();
  }
  function op(e) {
    return new this(e).sqrt();
  }
  function sp(e, t) {
    return new this(e).sub(t);
  }
  function ap() {
    var e = 0, t = arguments, r = new this(t[e]);
    for (x = false;r.s && ++e < t.length; )
      r = r.plus(t[e]);
    return x = true, y(r, this.precision, this.rounding);
  }
  function lp(e) {
    return new this(e).tan();
  }
  function up(e) {
    return new this(e).tanh();
  }
  function cp(e) {
    return y(e = new this(e), e.e + 1, 1);
  }
  function wt(e) {
    return e === null ? e : Array.isArray(e) ? e.map(wt) : typeof e == "object" ? pp(e) ? dp(e) : yt(e, wt) : e;
  }
  function pp(e) {
    return e !== null && typeof e == "object" && typeof e.$type == "string";
  }
  function dp({ $type: e, value: t }) {
    switch (e) {
      case "BigInt":
        return BigInt(t);
      case "Bytes":
        return Buffer.from(t, "base64");
      case "DateTime":
        return new Date(t);
      case "Decimal":
        return new xe(t);
      case "Json":
        return JSON.parse(t);
      default:
        Fe(t, "Unknown tagged value");
    }
  }
  function xt(e) {
    return e.substring(0, 1).toLowerCase() + e.substring(1);
  }
  function Pt(e) {
    return e instanceof Date || Object.prototype.toString.call(e) === "[object Date]";
  }
  function ln(e) {
    return e.toString() !== "Invalid Date";
  }
  function vt(e) {
    return it.isDecimal(e) ? true : e !== null && typeof e == "object" && typeof e.s == "number" && typeof e.e == "number" && typeof e.toFixed == "function" && Array.isArray(e.d);
  }
  function he(e, t, r, n, i) {
    this.type = e, this.content = t, this.alias = r, this.length = (n || "").length | 0, this.greedy = !!i;
  }
  function gp(e) {
    return Ds[e] || mp;
  }
  function _s(e) {
    return hp(e, P.languages.javascript);
  }
  function hp(e, t) {
    return P.tokenize(e, t).map((n) => he.stringify(n)).join("");
  }
  function Ls(e) {
    return (0, Fs.default)(e);
  }
  function Ep({ message: e, originalMethod: t, isPanic: r, callArguments: n }) {
    return { functionName: `prisma.${t}()`, message: e, isPanic: r ?? false, callArguments: n };
  }
  function wp({ callsite: e, message: t, originalMethod: r, isPanic: n, callArguments: i }, o) {
    let s = Ep({ message: t, originalMethod: r, isPanic: n, callArguments: i });
    if (!e || typeof window < "u" || false)
      return s;
    let a = e.getLocation();
    if (!a || !a.lineNumber || !a.columnNumber)
      return s;
    let l = Math.max(1, a.lineNumber - 3), u = cn.read(a.fileName)?.slice(l, a.lineNumber), c = u?.lineAt(a.lineNumber);
    if (u && c) {
      let p = Pp(c), d = xp(c);
      if (!d)
        return s;
      s.functionName = `${d.code})`, s.location = a, n || (u = u.mapLineAt(a.lineNumber, (g) => g.slice(0, d.openingBraceIndex))), u = o.highlightSource(u);
      let f = String(u.lastLineNumber).length;
      if (s.contextLines = u.mapLines((g, h) => o.gray(String(h).padStart(f)) + " " + g).mapLines((g) => o.dim(g)).prependSymbolAt(a.lineNumber, o.bold(o.red("\u2192"))), i) {
        let g = p + f + 1;
        g += 2, s.callArguments = (0, Ms.default)(i, g).slice(g);
      }
    }
    return s;
  }
  function xp(e) {
    let t = Object.keys(Je.ModelAction).join("|"), n = new RegExp(String.raw`\.(${t})\(`).exec(e);
    if (n) {
      let i = n.index + n[0].length, o = e.lastIndexOf(" ", n.index) + 1;
      return { code: e.slice(o, i), openingBraceIndex: i };
    }
    return null;
  }
  function Pp(e) {
    let t = 0;
    for (let r = 0;r < e.length; r++) {
      if (e.charAt(r) !== " ")
        return t;
      t++;
    }
    return t;
  }
  function vp({ functionName: e, location: t, message: r, isPanic: n, contextLines: i, callArguments: o }, s) {
    let a = [""], l = t ? " in" : ":";
    if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${l}`))) : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${l}`)), t && a.push(s.underline(Tp(t))), i) {
      a.push("");
      let u = [i.toString()];
      o && (u.push(o), u.push(s.dim(")"))), a.push(u.join("")), o && a.push("");
    } else
      a.push(""), o && a.push(o), a.push("");
    return a.push(r), a.join(`
`);
  }
  function Tp(e) {
    let t = [e.fileName];
    return e.lineNumber && t.push(String(e.lineNumber)), e.columnNumber && t.push(String(e.columnNumber)), t.join(":");
  }
  function Tt(e) {
    let t = e.showColors ? yp : bp, r;
    return r = wp(e, t), vp(r, t);
  }
  function Vs(e, t, r) {
    let n = Bs(e), i = Rp(n), o = Sp(i);
    o ? pn(o, t, r) : t.addErrorMessage(() => "Unknown error");
  }
  function Bs(e) {
    return e.errors.flatMap((t) => t.kind === "Union" ? Bs(t) : [t]);
  }
  function Rp(e) {
    let t = new Map, r = [];
    for (let n of e) {
      if (n.kind !== "InvalidArgumentType") {
        r.push(n);
        continue;
      }
      let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = t.get(i);
      o ? t.set(i, { ...n, argument: { ...n.argument, typeNames: Cp(o.argument.typeNames, n.argument.typeNames) } }) : t.set(i, n);
    }
    return r.push(...t.values()), r;
  }
  function Cp(e, t) {
    return [...new Set(e.concat(t))];
  }
  function Sp(e) {
    return xi(e, (t, r) => {
      let n = qs(t), i = qs(r);
      return n !== i ? n - i : js(t) - js(r);
    });
  }
  function qs(e) {
    let t = 0;
    return Array.isArray(e.selectionPath) && (t += e.selectionPath.length), Array.isArray(e.argumentPath) && (t += e.argumentPath.length), t;
  }
  function js(e) {
    switch (e.kind) {
      case "InvalidArgumentValue":
      case "ValueTooLarge":
        return 20;
      case "InvalidArgumentType":
        return 10;
      case "RequiredArgumentMissing":
        return -10;
      default:
        return 0;
    }
  }
  function pn(e, t, r) {
    switch (e.kind) {
      case "MutuallyExclusiveFields":
        Ip(e, t);
        break;
      case "IncludeOnScalar":
        Op(e, t);
        break;
      case "EmptySelection":
        kp(e, t, r);
        break;
      case "UnknownSelectionField":
        Lp(e, t);
        break;
      case "InvalidSelectionValue":
        Np(e, t);
        break;
      case "UnknownArgument":
        Mp(e, t);
        break;
      case "UnknownInputField":
        $p(e, t);
        break;
      case "RequiredArgumentMissing":
        qp(e, t);
        break;
      case "InvalidArgumentType":
        jp(e, t);
        break;
      case "InvalidArgumentValue":
        Vp(e, t);
        break;
      case "ValueTooLarge":
        Bp(e, t);
        break;
      case "SomeFieldsMissing":
        Up(e, t);
        break;
      case "TooManyFieldsGiven":
        Gp(e, t);
        break;
      case "Union":
        Vs(e, t, r);
        break;
      default:
        throw new Error("not implemented: " + e.kind);
    }
  }
  function Ip(e, t) {
    let r = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    r && (r.getField(e.firstField)?.markAsError(), r.getField(e.secondField)?.markAsError()), t.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);
  }
  function Op(e, t) {
    let [r, n] = ir(e.selectionPath), i = e.outputType, o = t.arguments.getDeepSelectionParent(r)?.value;
    if (o && (o.getField(n)?.markAsError(), i))
      for (let s of i.fields)
        s.isRelation && o.addSuggestion(new ue(s.name, "true"));
    t.addErrorMessage((s) => {
      let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
      return i ? a += ` on model ${s.bold(i.name)}. ${or(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
    });
  }
  function kp(e, t, r) {
    let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (n) {
      let i = n.getField("omit")?.value.asObject();
      if (i) {
        Dp(e, t, i);
        return;
      }
      if (n.hasField("select")) {
        _p(e, t);
        return;
      }
    }
    if (r?.[xt(e.outputType.name)]) {
      Fp(e, t);
      return;
    }
    t.addErrorMessage(() => `Unknown field at "${e.selectionPath.join(".")} selection"`);
  }
  function Dp(e, t, r) {
    r.removeAllFields();
    for (let n of e.outputType.fields)
      r.addSuggestion(new ue(n.name, "false"));
    t.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);
  }
  function _p(e, t) {
    let r = e.outputType, n = t.arguments.getDeepSelectionParent(e.selectionPath)?.value, i = n?.isEmpty() ?? false;
    n && (n.removeAllFields(), Ws(n, r)), t.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(r.name)} must not be empty. ${or(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(r.name)} needs ${o.bold("at least one truthy value")}.`);
  }
  function Fp(e, t) {
    let r = new nr;
    for (let i of e.outputType.fields)
      i.isRelation || r.addField(i.name, "false");
    let n = new ue("omit", r).makeRequired();
    if (e.selectionPath.length === 0)
      t.arguments.addSuggestion(n);
    else {
      let [i, o] = ir(e.selectionPath), a = t.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
      if (a) {
        let l = a?.value.asObject() ?? new At;
        l.addSuggestion(n), a.value = l;
      }
    }
    t.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);
  }
  function Lp(e, t) {
    let r = Hs(e.selectionPath, t);
    if (r.parentKind !== "unknown") {
      r.field.markAsError();
      let n = r.parent;
      switch (r.parentKind) {
        case "select":
          Ws(n, e.outputType);
          break;
        case "include":
          Qp(n, e.outputType);
          break;
        case "omit":
          Jp(n, e.outputType);
          break;
      }
    }
    t.addErrorMessage((n) => {
      let i = [`Unknown field ${n.red(`\`${r.fieldName}\``)}`];
      return r.parentKind !== "unknown" && i.push(`for ${n.bold(r.parentKind)} statement`), i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`), i.push(or(n)), i.join(" ");
    });
  }
  function Np(e, t) {
    let r = Hs(e.selectionPath, t);
    r.parentKind !== "unknown" && r.field.value.markAsError(), t.addErrorMessage((n) => `Invalid value for selection field \`${n.red(r.fieldName)}\`: ${e.underlyingError}`);
  }
  function Mp(e, t) {
    let r = e.argumentPath[0], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    n && (n.getField(r)?.markAsError(), Wp(n, e.arguments)), t.addErrorMessage((i) => Qs(i, r, e.arguments.map((o) => o.name)));
  }
  function $p(e, t) {
    let [r, n] = ir(e.argumentPath), i = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (i) {
      i.getDeepField(e.argumentPath)?.markAsError();
      let o = i.getDeepFieldValue(r)?.asObject();
      o && Ks(o, e.inputType);
    }
    t.addErrorMessage((o) => Qs(o, n, e.inputType.fields.map((s) => s.name)));
  }
  function Qs(e, t, r) {
    let n = [`Unknown argument \`${e.red(t)}\`.`], i = Kp(t, r);
    return i && n.push(`Did you mean \`${e.green(i)}\`?`), r.length > 0 && n.push(or(e)), n.join(" ");
  }
  function qp(e, t) {
    let r;
    t.addErrorMessage((l) => r?.value instanceof W && r.value.text === "null" ? `Argument \`${l.green(o)}\` must not be ${l.red("null")}.` : `Argument \`${l.green(o)}\` is missing.`);
    let n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (!n)
      return;
    let [i, o] = ir(e.argumentPath), s = new nr, a = n.getDeepFieldValue(i)?.asObject();
    if (a)
      if (r = a.getField(o), r && a.removeField(o), e.inputTypes.length === 1 && e.inputTypes[0].kind === "object") {
        for (let l of e.inputTypes[0].fields)
          s.addField(l.name, l.typeNames.join(" | "));
        a.addSuggestion(new ue(o, s).makeRequired());
      } else {
        let l = e.inputTypes.map(Js).join(" | ");
        a.addSuggestion(new ue(o, l).makeRequired());
      }
  }
  function Js(e) {
    return e.kind === "list" ? `${Js(e.elementType)}[]` : e.name;
  }
  function jp(e, t) {
    let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
      let o = gn("or", e.argument.typeNames.map((s) => i.green(s)));
      return `Argument \`${i.bold(r)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`;
    });
  }
  function Vp(e, t) {
    let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), t.addErrorMessage((i) => {
      let o = [`Invalid value for argument \`${i.bold(r)}\``];
      if (e.underlyingError && o.push(`: ${e.underlyingError}`), o.push("."), e.argument.typeNames.length > 0) {
        let s = gn("or", e.argument.typeNames.map((a) => i.green(a)));
        o.push(` Expected ${s}.`);
      }
      return o.join("");
    });
  }
  function Bp(e, t) {
    let r = e.argument.name, n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i;
    if (n) {
      let s = n.getDeepField(e.argumentPath)?.value;
      s?.markAsError(), s instanceof W && (i = s.text);
    }
    t.addErrorMessage((o) => {
      let s = ["Unable to fit value"];
      return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(r)}\``), s.join(" ");
    });
  }
  function Up(e, t) {
    let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (n) {
      let i = n.getDeepFieldValue(e.argumentPath)?.asObject();
      i && Ks(i, e.inputType);
    }
    t.addErrorMessage((i) => {
      let o = [`Argument \`${i.bold(r)}\` of type ${i.bold(e.inputType.name)} needs`];
      return e.constraints.minFieldCount === 1 ? e.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${gn("or", e.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`), o.push(or(i)), o.join(" ");
    });
  }
  function Gp(e, t) {
    let r = e.argumentPath[e.argumentPath.length - 1], n = t.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i = [];
    if (n) {
      let o = n.getDeepFieldValue(e.argumentPath)?.asObject();
      o && (o.markAsError(), i = Object.keys(o.getFields()));
    }
    t.addErrorMessage((o) => {
      let s = [`Argument \`${o.bold(r)}\` of type ${o.bold(e.inputType.name)} needs`];
      return e.constraints.minFieldCount === 1 && e.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : e.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${gn("and", i.map((a) => o.red(a)))}. Please choose`), e.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${e.constraints.maxFieldCount}.`), s.join(" ");
    });
  }
  function Ws(e, t) {
    for (let r of t.fields)
      e.hasField(r.name) || e.addSuggestion(new ue(r.name, "true"));
  }
  function Qp(e, t) {
    for (let r of t.fields)
      r.isRelation && !e.hasField(r.name) && e.addSuggestion(new ue(r.name, "true"));
  }
  function Jp(e, t) {
    for (let r of t.fields)
      !e.hasField(r.name) && !r.isRelation && e.addSuggestion(new ue(r.name, "true"));
  }
  function Wp(e, t) {
    for (let r of t)
      e.hasField(r.name) || e.addSuggestion(new ue(r.name, r.typeNames.join(" | ")));
  }
  function Hs(e, t) {
    let [r, n] = ir(e), i = t.arguments.getDeepSubSelectionValue(r)?.asObject();
    if (!i)
      return { parentKind: "unknown", fieldName: n };
    let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), l = o?.getField(n);
    return o && l ? { parentKind: "select", parent: o, field: l, fieldName: n } : (l = s?.getField(n), s && l ? { parentKind: "include", field: l, parent: s, fieldName: n } : (l = a?.getField(n), a && l ? { parentKind: "omit", field: l, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
  }
  function Ks(e, t) {
    if (t.kind === "object")
      for (let r of t.fields)
        e.hasField(r.name) || e.addSuggestion(new ue(r.name, r.typeNames.join(" | ")));
  }
  function ir(e) {
    let t = [...e], r = t.pop();
    if (!r)
      throw new Error("unexpected empty path");
    return [t, r];
  }
  function or({ green: e, enabled: t }) {
    return "Available options are " + (t ? `listed in ${e("green")}` : "marked with ?") + ".";
  }
  function gn(e, t) {
    if (t.length === 1)
      return t[0];
    let r = [...t], n = r.pop();
    return `${r.join(", ")} ${e} ${n}`;
  }
  function Kp(e, t) {
    let r = 1 / 0, n;
    for (let i of t) {
      let o = (0, Gs.default)(e, i);
      o > Hp || o < r && (r = o, n = i);
    }
    return n;
  }
  function zs(e) {
    return e.substring(0, 1).toLowerCase() + e.substring(1);
  }
  function It(e) {
    return e instanceof sr;
  }
  function Oi(e, t) {
    Object.defineProperty(e, "name", { value: t, configurable: true });
  }
  function Ot(e) {
    return new ki(Zs(e));
  }
  function Zs(e) {
    let t = new At;
    for (let [r, n] of Object.entries(e)) {
      let i = new bn(r, Xs(n));
      t.addField(i);
    }
    return t;
  }
  function Xs(e) {
    if (typeof e == "string")
      return new W(JSON.stringify(e));
    if (typeof e == "number" || typeof e == "boolean")
      return new W(String(e));
    if (typeof e == "bigint")
      return new W(`${e}n`);
    if (e === null)
      return new W("null");
    if (e === undefined)
      return new W("undefined");
    if (vt(e))
      return new W(`new Prisma.Decimal("${e.toFixed()}")`);
    if (e instanceof Uint8Array)
      return Buffer.isBuffer(e) ? new W(`Buffer.alloc(${e.byteLength})`) : new W(`new Uint8Array(${e.byteLength})`);
    if (e instanceof Date) {
      let t = ln(e) ? e.toISOString() : "Invalid Date";
      return new W(`new Date("${t}")`);
    }
    return e instanceof Me ? new W(`Prisma.${e._getName()}`) : It(e) ? new W(`prisma.${zs(e.modelName)}.\$fields.${e.name}`) : Array.isArray(e) ? zp(e) : typeof e == "object" ? Zs(e) : new W(Object.prototype.toString.call(e));
  }
  function zp(e) {
    let t = new St;
    for (let r of e)
      t.addItem(Xs(r));
    return t;
  }
  function En(e, t) {
    let r = t === "pretty" ? Us : fn, n = e.renderAllMessages(r), i = new Rt(0, { colors: r }).write(e).toString();
    return { message: n, args: i };
  }
  function wn({ args: e, errors: t, errorFormat: r, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
    let a = Ot(e);
    for (let p of t)
      pn(p, a, s);
    let { message: l, args: u } = En(a, r), c = Tt({ message: l, callsite: n, originalMethod: i, showColors: r === "pretty", callArguments: u });
    throw new J(c, { clientVersion: o });
  }
  function pr(e) {
    let t;
    return { get() {
      return t || (t = { value: e() }), t.value;
    } };
  }
  function Te(e) {
    return e.replace(/^./, (t) => t.toLowerCase());
  }
  function ta(e, t, r) {
    let n = Te(r);
    return !t.result || !(t.result.$allModels || t.result[n]) ? e : Yp({ ...e, ...ea(t.name, e, t.result.$allModels), ...ea(t.name, e, t.result[n]) });
  }
  function Yp(e) {
    let t = new ve, r = (n, i) => t.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), e[n] ? e[n].needs.flatMap((o) => r(o, i)) : [n]));
    return yt(e, (n) => ({ ...n, needs: r(n.name, new Set) }));
  }
  function ea(e, t, r) {
    return r ? yt(r, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: Zp(t, o, i) })) : {};
  }
  function Zp(e, t, r) {
    let n = e?.[t]?.compute;
    return n ? (i) => r({ ...i, [t]: n(i) }) : r;
  }
  function ra(e, t) {
    if (!t)
      return e;
    let r = { ...e };
    for (let n of Object.values(t))
      if (e[n.name])
        for (let i of n.needs)
          r[i] = true;
    return r;
  }
  function na(e, t) {
    if (!t)
      return e;
    let r = { ...e };
    for (let n of Object.values(t))
      if (!e[n.name])
        for (let i of n.needs)
          delete r[i];
    return r;
  }
  function Re(e) {
    return e instanceof dr;
  }
  function vn({ modelName: e, action: t, args: r, runtimeDataModel: n, extensions: i = kt.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c }) {
    let p = new Di({ runtimeDataModel: n, modelName: e, action: t, rootArgs: r, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c });
    return { modelName: e, action: Xp[t], query: mr(r, p) };
  }
  function mr({ select: e, include: t, ...r } = {}, n) {
    let i;
    return n.isPreviewFeatureOn("omitApi") && (i = r.omit, delete r.omit), { arguments: aa(r, n), selection: ed(e, t, i, n) };
  }
  function ed(e, t, r, n) {
    return e ? (t ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : r && n.isPreviewFeatureOn("omitApi") && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), id(e, n)) : td(n, t, r);
  }
  function td(e, t, r) {
    let n = {};
    return e.modelOrType && !e.isRawAction() && (n.$composites = true, n.$scalars = true), t && rd(n, t, e), e.isPreviewFeatureOn("omitApi") && nd(n, r, e), n;
  }
  function rd(e, t, r) {
    for (let [n, i] of Object.entries(t)) {
      if (Re(i))
        continue;
      let o = r.nestSelection(n);
      if (_i(i, o), i === false || i === undefined) {
        e[n] = false;
        continue;
      }
      let s = r.findField(n);
      if (s && s.kind !== "object" && r.throwValidationError({ kind: "IncludeOnScalar", selectionPath: r.getSelectionPath().concat(n), outputType: r.getOutputTypeDescription() }), s) {
        e[n] = mr(i === true ? {} : i, o);
        continue;
      }
      if (i === true) {
        e[n] = true;
        continue;
      }
      e[n] = mr(i, o);
    }
  }
  function nd(e, t, r) {
    let n = r.getComputedFields(), i = { ...r.getGlobalOmit(), ...t }, o = na(i, n);
    for (let [s, a] of Object.entries(o)) {
      if (Re(a))
        continue;
      _i(a, r.nestSelection(s));
      let l = r.findField(s);
      n?.[s] && !l || (e[s] = !a);
    }
  }
  function id(e, t) {
    let r = {}, n = t.getComputedFields(), i = ra(e, n);
    for (let [o, s] of Object.entries(i)) {
      if (Re(s))
        continue;
      let a = t.nestSelection(o);
      _i(s, a);
      let l = t.findField(o);
      if (!(n?.[o] && !l)) {
        if (s === false || s === undefined || Re(s)) {
          r[o] = false;
          continue;
        }
        if (s === true) {
          l?.kind === "object" ? r[o] = mr({}, a) : r[o] = true;
          continue;
        }
        r[o] = mr(s, a);
      }
    }
    return r;
  }
  function sa(e, t) {
    if (e === null)
      return null;
    if (typeof e == "string" || typeof e == "number" || typeof e == "boolean")
      return e;
    if (typeof e == "bigint")
      return { $type: "BigInt", value: String(e) };
    if (Pt(e)) {
      if (ln(e))
        return { $type: "DateTime", value: e.toISOString() };
      t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
    }
    if (It(e))
      return { $type: "FieldRef", value: { _ref: e.name, _container: e.modelName } };
    if (Array.isArray(e))
      return od(e, t);
    if (ArrayBuffer.isView(e))
      return { $type: "Bytes", value: Buffer.from(e).toString("base64") };
    if (sd(e))
      return e.values;
    if (vt(e))
      return { $type: "Decimal", value: e.toFixed() };
    if (e instanceof Me) {
      if (e !== yn.instances[e._getName()])
        throw new Error("Invalid ObjectEnumValue");
      return { $type: "Enum", value: e._getName() };
    }
    if (ad(e))
      return e.toJSON();
    if (typeof e == "object")
      return aa(e, t);
    t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: t.getSelectionPath(), argumentPath: t.getArgumentPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
  }
  function aa(e, t) {
    if (e.$type)
      return { $type: "Raw", value: e };
    let r = {};
    for (let n in e) {
      let i = e[n], o = t.nestArgument(n);
      Re(i) || (i !== undefined ? r[n] = sa(i, o) : t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: t.getSelectionPath(), argument: { name: t.getArgumentName(), typeNames: [] }, underlyingError: oa }));
    }
    return r;
  }
  function od(e, t) {
    let r = [];
    for (let n = 0;n < e.length; n++) {
      let i = t.nestArgument(String(n)), o = e[n];
      if (o === undefined || Re(o)) {
        let s = o === undefined ? "undefined" : "Prisma.skip";
        t.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${t.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
      }
      r.push(sa(o, i));
    }
    return r;
  }
  function sd(e) {
    return typeof e == "object" && e !== null && e.__prismaRawParameters__ === true;
  }
  function ad(e) {
    return typeof e == "object" && e !== null && typeof e.toJSON == "function";
  }
  function _i(e, t) {
    e === undefined && t.isPreviewFeatureOn("strictUndefinedChecks") && t.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: t.getSelectionPath(), underlyingError: oa });
  }
  function la(e) {
    return { models: Fi(e.models), enums: Fi(e.enums), types: Fi(e.types) };
  }
  function Fi(e) {
    let t = {};
    for (let { name: r, ...n } of e)
      t[r] = n;
    return t;
  }
  function ua(e, t) {
    let r = pr(() => ld(t));
    Object.defineProperty(e, "dmmf", { get: () => r.get() });
  }
  function ld(e) {
    return { datamodel: { models: Li(e.models), enums: Li(e.enums), types: Li(e.types) } };
  }
  function Li(e) {
    return Object.entries(e).map(([t, r]) => ({ name: t, ...r }));
  }
  function ca(e) {
    return (...t) => new Mi(e, t);
  }
  function pa(e) {
    return e != null && e[Tn] === Tn;
  }
  function fr(e) {
    return { ok: false, error: e, map() {
      return fr(e);
    }, flatMap() {
      return fr(e);
    } };
  }
  function Ce(e, t) {
    return async (...r) => {
      try {
        return await t(...r);
      } catch (n) {
        let i = e.registerNewError(n);
        return fr({ kind: "GenericJs", id: i });
      }
    };
  }
  function pd(e, t) {
    return (...r) => {
      try {
        return t(...r);
      } catch (n) {
        let i = e.registerNewError(n);
        return fr({ kind: "GenericJs", id: i });
      }
    };
  }
  function da(e, t = ",", r = "", n = "") {
    if (e.length === 0)
      throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
    return new oe([r, ...Array(e.length - 1).fill(t), n], e);
  }
  function ji(e) {
    return new oe([e], []);
  }
  function Vi(e, ...t) {
    return new oe(e, t);
  }
  function gr(e) {
    return { getKeys() {
      return Object.keys(e);
    }, getPropertyValue(t) {
      return e[t];
    } };
  }
  function re(e, t) {
    return { getKeys() {
      return [e];
    }, getPropertyValue() {
      return t();
    } };
  }
  function ot(e) {
    let t = new ve;
    return { getKeys() {
      return e.getKeys();
    }, getPropertyValue(r) {
      return t.getOrCreate(r, () => e.getPropertyValue(r));
    }, getPropertyDescriptor(r) {
      return e.getPropertyDescriptor?.(r);
    } };
  }
  function Cn(e) {
    let t = new Set(e);
    return { getOwnPropertyDescriptor: () => Rn, has: (r, n) => t.has(n), set: (r, n, i) => t.add(n) && Reflect.set(r, n, i), ownKeys: () => [...t] };
  }
  function Se(e, t) {
    let r = dd(t), n = new Set, i = new Proxy(e, { get(o, s) {
      if (n.has(s))
        return o[s];
      let a = r.get(s);
      return a ? a.getPropertyValue(s) : o[s];
    }, has(o, s) {
      if (n.has(s))
        return true;
      let a = r.get(s);
      return a ? a.has?.(s) ?? true : Reflect.has(o, s);
    }, ownKeys(o) {
      let s = ga(Reflect.ownKeys(o), r), a = ga(Array.from(r.keys()), r);
      return [...new Set([...s, ...a, ...n])];
    }, set(o, s, a) {
      return r.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
    }, getOwnPropertyDescriptor(o, s) {
      let a = Reflect.getOwnPropertyDescriptor(o, s);
      if (a && !a.configurable)
        return a;
      let l = r.get(s);
      return l ? l.getPropertyDescriptor ? { ...Rn, ...l?.getPropertyDescriptor(s) } : Rn : a;
    }, defineProperty(o, s, a) {
      return n.add(s), Reflect.defineProperty(o, s, a);
    } });
    return i[fa] = function() {
      let o = { ...this };
      return delete o[fa], o;
    }, i;
  }
  function dd(e) {
    let t = new Map;
    for (let r of e) {
      let n = r.getKeys();
      for (let i of n)
        t.set(i, r);
    }
    return t;
  }
  function ga(e, t) {
    return e.filter((r) => t.get(r)?.has?.(r) ?? true);
  }
  function _t(e) {
    return { getKeys() {
      return e;
    }, has() {
      return false;
    }, getPropertyValue() {
    } };
  }
  function Ft(e, t) {
    return { batch: e, transaction: t?.kind === "batch" ? { isolationLevel: t.options.isolationLevel } : undefined };
  }
  function ha(e) {
    if (e === undefined)
      return "";
    let t = Ot(e);
    return new Rt(0, { colors: fn }).write(t).toString();
  }
  function st({ error: e, user_facing_error: t }, r, n) {
    return t.error_code ? new V(fd(t, n), { code: t.error_code, clientVersion: r, meta: t.meta, batchRequestIdx: t.batch_request_idx }) : new B(e, { clientVersion: r, batchRequestIdx: t.batch_request_idx });
  }
  function fd(e, t) {
    let r = e.message;
    return (t === "postgresql" || t === "postgres" || t === "mysql") && e.error_code === md && (r += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), r;
  }
  function ya(e) {
    var t = e.split(`
`);
    return t.reduce(function(r, n) {
      var i = yd(n) || Ed(n) || Pd(n) || Cd(n) || Td(n);
      return i && r.push(i), r;
    }, []);
  }
  function yd(e) {
    var t = gd.exec(e);
    if (!t)
      return null;
    var r = t[2] && t[2].indexOf("native") === 0, n = t[2] && t[2].indexOf("eval") === 0, i = hd.exec(t[2]);
    return n && i != null && (t[2] = i[1], t[3] = i[2], t[4] = i[3]), { file: r ? null : t[2], methodName: t[1] || hr, arguments: r ? [t[2]] : [], lineNumber: t[3] ? +t[3] : null, column: t[4] ? +t[4] : null };
  }
  function Ed(e) {
    var t = bd.exec(e);
    return t ? { file: t[2], methodName: t[1] || hr, arguments: [], lineNumber: +t[3], column: t[4] ? +t[4] : null } : null;
  }
  function Pd(e) {
    var t = wd.exec(e);
    if (!t)
      return null;
    var r = t[3] && t[3].indexOf(" > eval") > -1, n = xd.exec(t[3]);
    return r && n != null && (t[3] = n[1], t[4] = n[2], t[5] = null), { file: t[3], methodName: t[1] || hr, arguments: t[2] ? t[2].split(",") : [], lineNumber: t[4] ? +t[4] : null, column: t[5] ? +t[5] : null };
  }
  function Td(e) {
    var t = vd.exec(e);
    return t ? { file: t[3], methodName: t[1] || hr, arguments: [], lineNumber: +t[4], column: t[5] ? +t[5] : null } : null;
  }
  function Cd(e) {
    var t = Rd.exec(e);
    return t ? { file: t[2], methodName: t[1] || hr, arguments: [], lineNumber: +t[3], column: t[4] ? +t[4] : null } : null;
  }
  function Ze(e) {
    return e === "minimal" ? typeof $EnabledCallSite == "function" && e !== "minimal" ? new $EnabledCallSite : new Bi : new Ui;
  }
  function Lt(e = {}) {
    let t = Ad(e);
    return Object.entries(t).reduce((n, [i, o]) => (ba[i] !== undefined ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
  }
  function Ad(e = {}) {
    return typeof e._count == "boolean" ? { ...e, _count: { _all: e._count } } : e;
  }
  function Sn(e = {}) {
    return (t) => (typeof e._count == "boolean" && (t._count = t._count._all), t);
  }
  function Ea(e, t) {
    let r = Sn(e);
    return t({ action: "aggregate", unpacker: r, argsMapper: Lt })(e);
  }
  function Id(e = {}) {
    let { select: t, ...r } = e;
    return typeof t == "object" ? Lt({ ...r, _count: t }) : Lt({ ...r, _count: { _all: true } });
  }
  function Od(e = {}) {
    return typeof e.select == "object" ? (t) => Sn(e)(t)._count : (t) => Sn(e)(t)._count._all;
  }
  function wa(e, t) {
    return t({ action: "count", unpacker: Od(e), argsMapper: Id })(e);
  }
  function kd(e = {}) {
    let t = Lt(e);
    if (Array.isArray(t.by))
      for (let r of t.by)
        typeof r == "string" && (t.select[r] = true);
    else
      typeof t.by == "string" && (t.select[t.by] = true);
    return t;
  }
  function Dd(e = {}) {
    return (t) => (typeof e?._count == "boolean" && t.forEach((r) => {
      r._count = r._count._all;
    }), t);
  }
  function xa(e, t) {
    return t({ action: "groupBy", unpacker: Dd(e), argsMapper: kd })(e);
  }
  function Pa(e, t, r) {
    if (t === "aggregate")
      return (n) => Ea(n, r);
    if (t === "count")
      return (n) => wa(n, r);
    if (t === "groupBy")
      return (n) => xa(n, r);
  }
  function va(e, t) {
    let r = t.fields.filter((i) => !i.relationName), n = wi(r, (i) => i.name);
    return new Proxy({}, { get(i, o) {
      if (o in i || typeof o == "symbol")
        return i[o];
      let s = n[o];
      if (s)
        return new sr(e, o, s.type, s.isList, s.kind === "enum");
    }, ...Cn(Object.keys(n)) });
  }
  function _d(e, t) {
    return e === undefined || t === undefined ? [] : [...t, "select", e];
  }
  function Fd(e, t, r) {
    return t === undefined ? e ?? {} : Ra(t, r, e || true);
  }
  function Qi(e, t, r, n, i, o) {
    let a = e._runtimeDataModel.models[t].fields.reduce((l, u) => ({ ...l, [u.name]: u }), {});
    return (l) => {
      let u = Ze(e._errorFormat), c = _d(n, i), p = Fd(l, o, c), d = r({ dataPath: c, callsite: u })(p), f = Ld(e, t);
      return new Proxy(d, { get(g, h) {
        if (!f.includes(h))
          return g[h];
        let T = [a[h].type, r, h], S = [c, p];
        return Qi(e, ...T, ...S);
      }, ...Cn([...f, ...Object.getOwnPropertyNames(d)]) });
    };
  }
  function Ld(e, t) {
    return e._runtimeDataModel.models[t].fields.filter((r) => r.kind === "object").map((r) => r.name);
  }
  function Ca(e, t, r, n) {
    return e === Je.ModelAction.findFirstOrThrow || e === Je.ModelAction.findUniqueOrThrow ? Nd(t, r, n) : n;
  }
  function Nd(e, t, r) {
    return async (n) => {
      if ("rejectOnNotFound" in n.args) {
        let o = Tt({ originalMethod: n.clientMethod, callsite: n.callsite, message: "'rejectOnNotFound' option is not supported" });
        throw new J(o, { clientVersion: t });
      }
      return await r(n).catch((o) => {
        throw o instanceof V && o.code === "P2025" ? new Le(`No ${e} found`, t) : o;
      });
    };
  }
  function Ji(e, t) {
    let r = e._extensions.getAllModelExtensions(t) ?? {}, n = [qd(e, t), Vd(e, t), gr(r), re("name", () => t), re("$name", () => t), re("$parent", () => e._appliedParent)];
    return Se({}, n);
  }
  function qd(e, t) {
    let r = Te(t), n = Object.keys(Je.ModelAction).concat("count");
    return { getKeys() {
      return n;
    }, getPropertyValue(i) {
      let o = i, s = (l) => e._request(l);
      s = Ca(o, t, e._clientVersion, s);
      let a = (l) => (u) => {
        let c = Ze(e._errorFormat);
        return e._createPrismaPromise((p) => {
          let d = { args: u, dataPath: [], action: o, model: t, clientMethod: `${r}.${i}`, jsModelName: r, transaction: p, callsite: c };
          return s({ ...d, ...l });
        });
      };
      return Md.includes(o) ? Qi(e, t, a) : jd(i) ? Pa(e, i, a) : a({});
    } };
  }
  function jd(e) {
    return $d.includes(e);
  }
  function Vd(e, t) {
    return ot(re("fields", () => {
      let r = e._runtimeDataModel.models[t];
      return va(t, r);
    }));
  }
  function Sa(e) {
    return e.replace(/^./, (t) => t.toUpperCase());
  }
  function yr(e) {
    let t = [Bd(e), re(Wi, () => e), re("$parent", () => e._appliedParent)], r = e._extensions.getAllClientExtensions();
    return r && t.push(gr(r)), Se(e, t);
  }
  function Bd(e) {
    let t = Object.keys(e._runtimeDataModel.models), r = t.map(Te), n = [...new Set(t.concat(r))];
    return ot({ getKeys() {
      return n;
    }, getPropertyValue(i) {
      let o = Sa(i);
      if (e._runtimeDataModel.models[o] !== undefined)
        return Ji(e, o);
      if (e._runtimeDataModel.models[i] !== undefined)
        return Ji(e, i);
    }, getPropertyDescriptor(i) {
      if (!r.includes(i))
        return { enumerable: false };
    } });
  }
  function Aa(e) {
    return e[Wi] ? e[Wi] : e;
  }
  function Ia(e) {
    if (typeof e == "function")
      return e(this);
    if (e.client?.__AccelerateEngine) {
      let r = e.client.__AccelerateEngine;
      this._originalClient._engine = new r(this._originalClient._accelerateEngineConfig);
    }
    let t = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e) }, _appliedParent: { value: this, configurable: true }, $use: { value: undefined }, $on: { value: undefined } });
    return yr(t);
  }
  function Oa({ result: e, modelName: t, select: r, omit: n, extensions: i }) {
    let o = i.getAllComputedFields(t);
    if (!o)
      return e;
    let s = [], a = [];
    for (let l of Object.values(o)) {
      if (n) {
        if (n[l.name])
          continue;
        let u = l.needs.filter((c) => n[c]);
        u.length > 0 && a.push(_t(u));
      } else if (r) {
        if (!r[l.name])
          continue;
        let u = l.needs.filter((c) => !r[c]);
        u.length > 0 && a.push(_t(u));
      }
      Ud(e, l.needs) && s.push(Gd(l, Se(e, s)));
    }
    return s.length > 0 || a.length > 0 ? Se(e, [...s, ...a]) : e;
  }
  function Ud(e, t) {
    return t.every((r) => Ei(e, r));
  }
  function Gd(e, t) {
    return ot(re(e.name, () => e.compute(t)));
  }
  function An({ visitor: e, result: t, args: r, runtimeDataModel: n, modelName: i }) {
    if (Array.isArray(t)) {
      for (let s = 0;s < t.length; s++)
        t[s] = An({ result: t[s], args: r, modelName: i, runtimeDataModel: n, visitor: e });
      return t;
    }
    let o = e(t, i, r) ?? t;
    return r.include && ka({ includeOrSelect: r.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), r.select && ka({ includeOrSelect: r.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), o;
  }
  function ka({ includeOrSelect: e, result: t, parentModelName: r, runtimeDataModel: n, visitor: i }) {
    for (let [o, s] of Object.entries(e)) {
      if (!s || t[o] == null || Re(s))
        continue;
      let l = n.models[r].fields.find((c) => c.name === o);
      if (!l || l.kind !== "object" || !l.relationName)
        continue;
      let u = typeof s == "object" ? s : {};
      t[o] = An({ visitor: i, result: t[o], args: u, modelName: l.type, runtimeDataModel: n });
    }
  }
  function Da({ result: e, modelName: t, args: r, extensions: n, runtimeDataModel: i, globalOmit: o }) {
    return n.isEmpty() || e == null || typeof e != "object" || !i.models[t] ? e : An({ result: e, args: r ?? {}, modelName: t, runtimeDataModel: i, visitor: (a, l, u) => {
      let c = Te(l);
      return Oa({ result: a, modelName: c, select: u.select, omit: u.select ? undefined : { ...o?.[c], ...u.omit }, extensions: n });
    } });
  }
  function _a(e) {
    if (e instanceof oe)
      return Qd(e);
    if (Array.isArray(e)) {
      let r = [e[0]];
      for (let n = 1;n < e.length; n++)
        r[n] = br(e[n]);
      return r;
    }
    let t = {};
    for (let r in e)
      t[r] = br(e[r]);
    return t;
  }
  function Qd(e) {
    return new oe(e.strings, e.values);
  }
  function br(e) {
    if (typeof e != "object" || e == null || e instanceof Me || It(e))
      return e;
    if (vt(e))
      return new xe(e.toFixed());
    if (Pt(e))
      return new Date(+e);
    if (ArrayBuffer.isView(e))
      return e.slice(0);
    if (Array.isArray(e)) {
      let t = e.length, r;
      for (r = Array(t);t--; )
        r[t] = br(e[t]);
      return r;
    }
    if (typeof e == "object") {
      let t = {};
      for (let r in e)
        r === "__proto__" ? Object.defineProperty(t, r, { value: br(e[r]), configurable: true, enumerable: true, writable: true }) : t[r] = br(e[r]);
      return t;
    }
    Fe(e, "Unknown value");
  }
  function La(e, t, r, n = 0) {
    return e._createPrismaPromise((i) => {
      let o = t.customDataProxyFetch;
      return "transaction" in t && i !== undefined && (t.transaction?.kind === "batch" && t.transaction.lock.then(), t.transaction = i), n === r.length ? e._executeRequest(t) : r[n]({ model: t.model, operation: t.model ? t.action : t.clientMethod, args: _a(t.args ?? {}), __internalParams: t, query: (s, a = t) => {
        let l = a.customDataProxyFetch;
        return a.customDataProxyFetch = qa(o, l), a.args = s, La(e, a, r, n + 1);
      } });
    });
  }
  function Na(e, t) {
    let { jsModelName: r, action: n, clientMethod: i } = t, o = r ? n : i;
    if (e._extensions.isEmpty())
      return e._executeRequest(t);
    let s = e._extensions.getAllQueryCallbacks(r ?? "$none", o);
    return La(e, t, s);
  }
  function Ma(e) {
    return (t) => {
      let r = { requests: t }, n = t[0].extensions.getAllBatchQueryCallbacks();
      return n.length ? $a(r, n, 0, e) : e(r);
    };
  }
  function $a(e, t, r, n) {
    if (r === t.length)
      return n(e);
    let i = e.customDataProxyFetch, o = e.requests[0].transaction;
    return t[r]({ args: { queries: e.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : undefined } : undefined }, __internalParams: e, query(s, a = e) {
      let l = a.customDataProxyFetch;
      return a.customDataProxyFetch = qa(i, l), $a(a, t, r + 1, n);
    } });
  }
  function qa(e = Fa, t = Fa) {
    return (r) => e(t(r));
  }
  function Ba({ postinstall: e, ciName: t, clientVersion: r }) {
    if (ja("checkPlatformCaching:postinstall", e), ja("checkPlatformCaching:ciName", t), e === true && t && t in Va) {
      let n = `Prisma has detected that this project was built on ${t}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${Va[t]}-build`;
      throw console.error(n), new R(n, r);
    }
  }
  function Ua(e, t) {
    return e ? e.datasources ? e.datasources : e.datasourceUrl ? { [t[0]]: { url: e.datasourceUrl } } : {} : {};
  }
  function Ga() {
    return typeof Netlify == "object" ? "netlify" : typeof EdgeRuntime == "string" ? "edge-light" : globalThis.navigator?.userAgent === Jd ? "workerd" : globalThis.Deno ? "deno" : globalThis.__lagon__ ? "lagon" : globalThis.process?.release?.name === Wd ? "node" : globalThis.Bun ? "bun" : globalThis.fastly ? "fastly" : "unknown";
  }
  function In() {
    let e = Ga();
    return { id: e, prettyName: Hd[e] || e, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e) };
  }
  function On(e) {
    let { runtimeBinaryTarget: t } = e;
    return `Add "${t}" to \`binaryTargets\` in the "schema.prisma" file and run \`prisma generate\` after saving it:

${Kd(e)}`;
  }
  function Kd(e) {
    let { generator: t, generatorBinaryTargets: r, runtimeBinaryTarget: n } = e, i = { fromEnvVar: null, value: n }, o = [...r, i];
    return hi({ ...t, binaryTargets: o });
  }
  function Xe(e) {
    let { runtimeBinaryTarget: t } = e;
    return `Prisma Client could not locate the Query Engine for runtime "${t}".`;
  }
  function et(e) {
    let { searchedLocations: t } = e;
    return `The following locations have been searched:
${[...new Set(t)].map((i) => `  ${i}`).join(`
`)}`;
  }
  function Qa(e) {
    let { runtimeBinaryTarget: t } = e;
    return `${Xe(e)}

This happened because \`binaryTargets\` have been pinned, but the actual deployment also required "${t}".
${On(e)}

${et(e)}`;
  }
  function kn(e) {
    return `We would appreciate if you could take the time to share some information with us.
Please help us by answering a few questions: https://pris.ly/${e}`;
  }
  function Dn(e) {
    let { errorStack: t } = e;
    return t?.match(/\/\.next|\/next@|\/next\//) ? `

We detected that you are using Next.js, learn how to fix this: https://pris.ly/d/engine-not-found-nextjs.` : "";
  }
  function Ja(e) {
    let { queryEngineName: t } = e;
    return `${Xe(e)}${Dn(e)}

This is likely caused by a bundler that has not copied "${t}" next to the resulting bundle.
Ensure that "${t}" has been copied next to the bundle or in "${e.expectedLocation}".

${kn("engine-not-found-bundler-investigation")}

${et(e)}`;
  }
  function Wa(e) {
    let { runtimeBinaryTarget: t, generatorBinaryTargets: r } = e, n = r.find((i) => i.native);
    return `${Xe(e)}

This happened because Prisma Client was generated for "${n?.value ?? "unknown"}", but the actual deployment required "${t}".
${On(e)}

${et(e)}`;
  }
  function Ha(e) {
    let { queryEngineName: t } = e;
    return `${Xe(e)}${Dn(e)}

This is likely caused by tooling that has not copied "${t}" to the deployment folder.
Ensure that you ran \`prisma generate\` and that "${t}" has been copied to "${e.expectedLocation}".

${kn("engine-not-found-tooling-investigation")}

${et(e)}`;
  }
  async function za(e, t) {
    let r = { binary: process.env.PRISMA_QUERY_ENGINE_BINARY, library: process.env.PRISMA_QUERY_ENGINE_LIBRARY }[e] ?? t.prismaPath;
    if (r !== undefined)
      return r;
    let { enginePath: n, searchedLocations: i } = await Zd(e, t);
    if (zd("enginePath", n), n !== undefined && e === "binary" && li(n), n !== undefined)
      return t.prismaPath = n;
    let o = await nt(), s = t.generator?.binaryTargets ?? [], a = s.some((d) => d.native), l = !s.some((d) => d.value === o), u = __filename.match(Yd()) === null, c = { searchedLocations: i, generatorBinaryTargets: s, generator: t.generator, runtimeBinaryTarget: o, queryEngineName: Ya(e, o), expectedLocation: Er.default.relative(process.cwd(), t.dirname), errorStack: new Error().stack }, p;
    throw a && l ? p = Wa(c) : l ? p = Qa(c) : u ? p = Ja(c) : p = Ha(c), new R(p, t.clientVersion);
  }
  async function Zd(engineType, config) {
    let binaryTarget = await nt(), searchedLocations = [], dirname = eval("__dirname"), searchLocations = [config.dirname, Er.default.resolve(dirname, ".."), config.generator?.output?.value ?? dirname, Er.default.resolve(dirname, "../../../.prisma/client"), "/tmp/prisma-engines", config.cwd];
    __filename.includes("resolveEnginePath") && searchLocations.push(Yo());
    for (let e of searchLocations) {
      let t = Ya(engineType, binaryTarget), r = Er.default.join(e, t);
      if (searchedLocations.push(e), Ka.default.existsSync(r))
        return { enginePath: r, searchedLocations };
    }
    return { enginePath: undefined, searchedLocations };
  }
  function Ya(e, t) {
    return e === "library" ? qr(t, "fs") : `query-engine-${t}${t === "windows" ? ".exe" : ""}`;
  }
  function Za(e) {
    return e ? e.replace(/".*"/g, '"X"').replace(/[\s:\[]([+-]?([0-9]*[.])?[0-9]+)/g, (t) => `${t[0]}5`) : "";
  }
  function Xa(e) {
    return e.split(`
`).map((t) => t.replace(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\s*/, "").replace(/\+\d+\s*ms$/, "")).join(`
`);
  }
  function tl({ title: e, user: t = "prisma", repo: r = "prisma", template: n = "bug_report.yml", body: i }) {
    return (0, el.default)({ user: t, repo: r, template: n, title: e, body: i });
  }
  function rl({ version: e, binaryTarget: t, title: r, description: n, engineVersion: i, database: o, query: s }) {
    let a = So(6000 - (s?.length ?? 0)), l = Xa((0, Hi.default)(a)), u = n ? `# Description
\`\`\`
${n}
\`\`\`` : "", c = (0, Hi.default)(`Hi Prisma Team! My Prisma Client just crashed. This is the report:
## Versions

| Name            | Version            |
|-----------------|--------------------|
| Node            | ${process.version?.padEnd(19)}| 
| OS              | ${t?.padEnd(19)}|
| Prisma Client   | ${e?.padEnd(19)}|
| Query Engine    | ${i?.padEnd(19)}|
| Database        | ${o?.padEnd(19)}|

${u}

## Logs
\`\`\`
${l}
\`\`\`

## Client Snippet
\`\`\`ts
// PLEASE FILL YOUR CODE SNIPPET HERE
\`\`\`

## Schema
\`\`\`prisma
// PLEASE ADD YOUR SCHEMA HERE IF POSSIBLE
\`\`\`

## Prisma Engine Query
\`\`\`
${s ? Za(s) : ""}
\`\`\`
`), p = tl({ title: r, body: c });
    return `${r}

This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.

${X(p)}

If you want the Prisma team to look into it, please open the link above \uD83D\uDE4F
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`;
  }
  function Nt({ inlineDatasources: e, overrideDatasources: t, env: r, clientVersion: n }) {
    let i, o = Object.keys(e)[0], s = e[o]?.url, a = t[o]?.url;
    if (o === undefined ? i = undefined : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = r[s.fromEnvVar]), s?.fromEnvVar !== undefined && i === undefined)
      throw new R(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
    if (i === undefined)
      throw new R("error: Missing URL environment variable, value, or override.", n);
    return i;
  }
  function A(e, t) {
    return { ...e, isRetryable: t };
  }
  async function tm(e) {
    let t;
    try {
      t = await e.text();
    } catch {
      return { type: "EmptyError" };
    }
    try {
      let r = JSON.parse(t);
      if (typeof r == "string")
        switch (r) {
          case "InternalDataProxyError":
            return { type: "DataProxyError", body: r };
          default:
            return { type: "UnknownTextError", body: r };
        }
      if (typeof r == "object" && r !== null) {
        if ("is_panic" in r && "message" in r && "error_code" in r)
          return { type: "QueryEngineError", body: r };
        if ("EngineNotStarted" in r || "InteractiveTransactionMisrouted" in r || "InvalidRequestError" in r) {
          let n = Object.values(r)[0].reason;
          return typeof n == "string" && !["SchemaMissing", "EngineVersionNotSupported"].includes(n) ? { type: "UnknownJsonError", body: r } : { type: "DataProxyError", body: r };
        }
      }
      return { type: "UnknownJsonError", body: r };
    } catch {
      return t === "" ? { type: "EmptyError" } : { type: "UnknownTextError", body: t };
    }
  }
  async function Or(e, t) {
    if (e.ok)
      return;
    let r = { clientVersion: t, response: e }, n = await tm(e);
    if (n.type === "QueryEngineError")
      throw new V(n.body.message, { code: n.body.error_code, clientVersion: t });
    if (n.type === "DataProxyError") {
      if (n.body === "InternalDataProxyError")
        throw new $t(r, "Internal Data Proxy error");
      if ("EngineNotStarted" in n.body) {
        if (n.body.EngineNotStarted.reason === "SchemaMissing")
          return new ut(r);
        if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported")
          throw new vr(r);
        if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
          let { msg: i, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
          throw new Pr(r, i, o);
        }
        if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
          let { msg: i, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
          throw new R(i, t, o);
        }
        if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
          let { logs: i } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
          throw new xr(r, i);
        }
      }
      if ("InteractiveTransactionMisrouted" in n.body) {
        let i = { IDParseError: "Could not parse interactive transaction ID", NoQueryEngineFoundError: "Could not find Query Engine for the specified host and transaction ID", TransactionStartError: "Could not start interactive transaction" };
        throw new Rr(r, i[n.body.InteractiveTransactionMisrouted.reason]);
      }
      if ("InvalidRequestError" in n.body)
        throw new Cr(r, n.body.InvalidRequestError.reason);
    }
    if (e.status === 401 || e.status === 403)
      throw new Ar(r, qt(Xi, n));
    if (e.status === 404)
      return new Sr(r, qt(Yi, n));
    if (e.status === 429)
      throw new Ir(r, qt(eo, n));
    if (e.status === 504)
      throw new Tr(r, qt(zi, n));
    if (e.status >= 500)
      throw new $t(r, qt(Zi, n));
    if (e.status >= 400)
      throw new wr(r, qt(Ki, n));
  }
  function qt(e, t) {
    return t.type === "EmptyError" ? e : `${e}: ${JSON.stringify(t)}`;
  }
  function nl(e) {
    let t = Math.pow(2, e) * 50, r = Math.ceil(Math.random() * t) - Math.ceil(t / 2), n = t + r;
    return new Promise((i) => setTimeout(() => i(n), n));
  }
  function il(e) {
    let t = new TextEncoder().encode(e), r = "", n = t.byteLength, i = n % 3, o = n - i, s, a, l, u, c;
    for (let p = 0;p < o; p = p + 3)
      c = t[p] << 16 | t[p + 1] << 8 | t[p + 2], s = (c & 16515072) >> 18, a = (c & 258048) >> 12, l = (c & 4032) >> 6, u = c & 63, r += $e[s] + $e[a] + $e[l] + $e[u];
    return i == 1 ? (c = t[o], s = (c & 252) >> 2, a = (c & 3) << 4, r += $e[s] + $e[a] + "==") : i == 2 && (c = t[o] << 8 | t[o + 1], s = (c & 64512) >> 10, a = (c & 1008) >> 4, l = (c & 15) << 2, r += $e[s] + $e[a] + $e[l] + "="), r;
  }
  function ol(e) {
    if (!!e.generator?.previewFeatures.some((r) => r.toLowerCase().includes("metrics")))
      throw new R("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate", e.clientVersion);
  }
  function rm(e) {
    return e[0] * 1000 + e[1] / 1e6;
  }
  function sl(e) {
    return new Date(rm(e));
  }
  async function ct(e, t, r = (n) => n) {
    let n = t.clientVersion;
    try {
      return typeof fetch == "function" ? await r(fetch)(e, t) : await r(to)(e, t);
    } catch (i) {
      let o = i.message ?? "Unknown error";
      throw new kr(o, { clientVersion: n });
    }
  }
  function im(e) {
    return { ...e.headers, "Content-Type": "application/json" };
  }
  function om(e) {
    return { method: e.method, headers: im(e) };
  }
  function sm(e, t) {
    return { text: () => Promise.resolve(Buffer.concat(e).toString()), json: () => Promise.resolve().then(() => JSON.parse(Buffer.concat(e).toString())), ok: t.statusCode >= 200 && t.statusCode <= 299, status: t.statusCode, url: t.url, headers: new ro(t.headers) };
  }
  async function to(e, t = {}) {
    let r = am("https"), n = om(t), i = [], { origin: o } = new URL(e);
    return new Promise((s, a) => {
      let l = r.request(e, n, (u) => {
        let { statusCode: c, headers: { location: p } } = u;
        c >= 301 && c <= 399 && p && (p.startsWith("http") === false ? s(to(`${o}${p}`, t)) : s(to(p, t))), u.on("data", (d) => i.push(d)), u.on("end", () => s(sm(i, u))), u.on("error", a);
      });
      l.on("error", a), l.end(t.body ?? "");
    });
  }
  async function um(e, t) {
    let r = al["@prisma/engines-version"], n = t.clientVersion ?? "unknown";
    if (process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION)
      return process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
    if (e.includes("accelerate") && n !== "0.0.0" && n !== "in-memory")
      return n;
    let [i, o] = n?.split("-") ?? [];
    if (o === undefined && lm.test(i))
      return i;
    if (o !== undefined || n === "0.0.0" || n === "in-memory") {
      if (e.startsWith("localhost") || e.startsWith("127.0.0.1"))
        return "0.0.0";
      let [s] = r.split("-") ?? [], [a, l, u] = s.split("."), c = cm(`<=${a}.${l}.${u}`), p = await ct(c, { clientVersion: n });
      if (!p.ok)
        throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${p.status} ${p.statusText}, response body: ${await p.text() || "<empty body>"}`);
      let d = await p.text();
      ll("length of body fetched from unpkg.com", d.length);
      let f;
      try {
        f = JSON.parse(d);
      } catch (g) {
        throw console.error("JSON.parse error: body fetched from unpkg.com: ", d), g;
      }
      return f.version;
    }
    throw new lt("Only `major.minor.patch` versions are supported by Accelerate.", { clientVersion: n });
  }
  async function ul(e, t) {
    let r = await um(e, t);
    return ll("version", r), r;
  }
  function cm(e) {
    return encodeURI(`https://unpkg.com/prisma@${e}/package.json`);
  }
  function pl(e) {
    if (e?.kind === "itx")
      return e.options.id;
  }
  function pm() {
    let e = globalThis;
    return e[oo] === undefined && (e[oo] = {}), e[oo];
  }
  function dm(e) {
    let t = pm();
    if (t[e] !== undefined)
      return t[e];
    let r = dl.default.toNamespacedPath(e), n = { exports: {} }, i = 0;
    return process.platform !== "win32" && (i = so.default.constants.dlopen.RTLD_LAZY | so.default.constants.dlopen.RTLD_DEEPBIND), process.dlopen(n, r, i), t[e] = n.exports, n.exports;
  }
  function fm(e) {
    return e.item_type === "query" && "query" in e;
  }
  function gm(e) {
    return "level" in e ? e.level === "error" && e.message === "PANIC" : false;
  }
  function hm(e) {
    return typeof e == "object" && e !== null && e.error_code !== undefined;
  }
  function lo(e, t) {
    return rl({ binaryTarget: e.binaryTarget, title: t, version: e.config.clientVersion, engineVersion: e.versionInfo?.commit, database: e.config.activeProvider, query: e.lastQuery });
  }
  function hl({ copyEngine: e = true }, t) {
    let r;
    try {
      r = Nt({ inlineDatasources: t.inlineDatasources, overrideDatasources: t.overrideDatasources, env: { ...t.env, ...process.env }, clientVersion: t.clientVersion });
    } catch {
    }
    let n = !!(r?.startsWith("prisma://") || r?.startsWith("prisma+postgres://"));
    e && n && tr("recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)");
    let i = Yt(t.generator), o = n || !e, s = !!t.adapter, a = i === "library", l = i === "binary";
    if (o && s || s && false) {
      let u;
      throw e ? r?.startsWith("prisma://") ? u = ["Prisma Client was configured to use the `adapter` option but the URL was a `prisma://` URL.", "Please either use the `prisma://` URL or remove the `adapter` from the Prisma Client constructor."] : u = ["Prisma Client was configured to use both the `adapter` and Accelerate, please chose one."] : u = ["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."], new J(u.join(`
`), { clientVersion: t.clientVersion });
    }
    if (o)
      return new Dr(t);
    if (a)
      return new _r(t);
    throw new J("Invalid client engine type, please use `library` or `binary`", { clientVersion: t.clientVersion });
  }
  function Fn({ generator: e }) {
    return e?.previewFeatures ?? [];
  }
  function jt(e) {
    try {
      return El(e, "fast");
    } catch {
      return El(e, "slow");
    }
  }
  function El(e, t) {
    return JSON.stringify(e.map((r) => xl(r, t)));
  }
  function xl(e, t) {
    return Array.isArray(e) ? e.map((r) => xl(r, t)) : typeof e == "bigint" ? { prisma__type: "bigint", prisma__value: e.toString() } : Pt(e) ? { prisma__type: "date", prisma__value: e.toJSON() } : xe.isDecimal(e) ? { prisma__type: "decimal", prisma__value: e.toJSON() } : Buffer.isBuffer(e) ? { prisma__type: "bytes", prisma__value: e.toString("base64") } : ym(e) || ArrayBuffer.isView(e) ? { prisma__type: "bytes", prisma__value: Buffer.from(e).toString("base64") } : typeof e == "object" && t === "slow" ? Pl(e) : e;
  }
  function ym(e) {
    return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer ? true : typeof e == "object" && e !== null ? e[Symbol.toStringTag] === "ArrayBuffer" || e[Symbol.toStringTag] === "SharedArrayBuffer" : false;
  }
  function Pl(e) {
    if (typeof e != "object" || e === null)
      return e;
    if (typeof e.toJSON == "function")
      return e.toJSON();
    if (Array.isArray(e))
      return e.map(wl);
    let t = {};
    for (let r of Object.keys(e))
      t[r] = wl(e[r]);
    return t;
  }
  function wl(e) {
    return typeof e == "bigint" ? e.toString() : Pl(e);
  }
  function uo(e, t, r, n) {
    if (!(e !== "postgresql" && e !== "cockroachdb") && r.length > 0 && Em.exec(t))
      throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
  }
  function po(e) {
    return function(r) {
      let n, i = (o = e) => {
        try {
          return o === undefined || o?.kind === "itx" ? n ??= Sl(r(o)) : Sl(r(o));
        } catch (s) {
          return Promise.reject(s);
        }
      };
      return { then(o, s) {
        return i().then(o, s);
      }, catch(o) {
        return i().catch(o);
      }, finally(o) {
        return i().finally(o);
      }, requestTransaction(o) {
        let s = i(o);
        return s.requestTransaction ? s.requestTransaction(o) : s;
      }, [Symbol.toStringTag]: "PrismaPromise" };
    };
  }
  function Sl(e) {
    return typeof e.then == "function" ? e : Promise.resolve(e);
  }
  function Il(e) {
    return e.includes("tracing") ? new mo : Al;
  }
  function Ol(e, t = () => {
  }) {
    let r, n = new Promise((i) => r = i);
    return { then(i) {
      return --e === 0 && r(t()), i?.(n);
    } };
  }
  function kl(e) {
    return typeof e == "string" ? e : e.reduce((t, r) => {
      let n = typeof r == "string" ? r : r.level;
      return n === "query" ? t : t && (r === "info" || t === "info") ? "info" : n;
    }, undefined);
  }
  function Nn(e) {
    return typeof e.batchRequestIdx == "number";
  }
  function Dl(e) {
    if (e.action !== "findUnique" && e.action !== "findUniqueOrThrow")
      return;
    let t = [];
    return e.modelName && t.push(e.modelName), e.query.arguments && t.push(fo(e.query.arguments)), t.push(fo(e.query.selection)), t.join("");
  }
  function fo(e) {
    return `(${Object.keys(e).sort().map((r) => {
      let n = e[r];
      return typeof n == "object" && n !== null ? `(${r} ${fo(n)})` : r;
    }).join(" ")})`;
  }
  function go(e) {
    return wm[e];
  }
  function pt(e, t) {
    if (t === null)
      return t;
    switch (e) {
      case "bigint":
        return BigInt(t);
      case "bytes":
        return Buffer.from(t, "base64");
      case "decimal":
        return new xe(t);
      case "datetime":
      case "date":
        return new Date(t);
      case "time":
        return new Date(`1970-01-01T${t}Z`);
      case "bigint-array":
        return t.map((r) => pt("bigint", r));
      case "bytes-array":
        return t.map((r) => pt("bytes", r));
      case "decimal-array":
        return t.map((r) => pt("decimal", r));
      case "datetime-array":
        return t.map((r) => pt("datetime", r));
      case "date-array":
        return t.map((r) => pt("date", r));
      case "time-array":
        return t.map((r) => pt("time", r));
      default:
        return t;
    }
  }
  function _l(e) {
    let t = [], r = xm(e);
    for (let n = 0;n < e.rows.length; n++) {
      let i = e.rows[n], o = { ...r };
      for (let s = 0;s < i.length; s++)
        o[e.columns[s]] = pt(e.types[s], i[s]);
      t.push(o);
    }
    return t;
  }
  function xm(e) {
    let t = {};
    for (let r = 0;r < e.columns.length; r++)
      t[e.columns[r]] = null;
    return t;
  }
  function vm(e) {
    if (e) {
      if (e.kind === "batch")
        return { kind: "batch", options: { isolationLevel: e.isolationLevel } };
      if (e.kind === "itx")
        return { kind: "itx", options: Ll(e) };
      Fe(e, "Unknown transaction kind");
    }
  }
  function Ll(e) {
    return { id: e.id, payload: e.payload };
  }
  function Tm(e, t) {
    return Nn(e) && t?.kind === "batch" && e.batchRequestIdx !== t.index;
  }
  function Rm(e) {
    return e.code === "P2009" || e.code === "P2012";
  }
  function Nl(e) {
    if (e.kind === "Union")
      return { kind: "Union", errors: e.errors.map(Nl) };
    if (Array.isArray(e.selectionPath)) {
      let [, ...t] = e.selectionPath;
      return { ...e, selectionPath: t };
    }
    return e;
  }
  function Gl(e, t) {
    for (let [r, n] of Object.entries(e)) {
      if (!ql.includes(r)) {
        let i = Vt(r, ql);
        throw new F(`Unknown property ${r} provided to PrismaClient constructor.${i}`);
      }
      Sm[r](n, t);
    }
    if (e.datasourceUrl && e.datasources)
      throw new F('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
  }
  function Vt(e, t) {
    if (t.length === 0 || typeof e != "string")
      return "";
    let r = Am(e, t);
    return r ? ` Did you mean "${r}"?` : "";
  }
  function Am(e, t) {
    if (t.length === 0)
      return null;
    let r = t.map((i) => ({ value: i, distance: (0, Ul.default)(e, i) }));
    r.sort((i, o) => i.distance < o.distance ? -1 : 1);
    let n = r[0];
    return n.distance < 3 ? n.value : null;
  }
  function Im(e, t) {
    return Bl(t.models, e) ?? Bl(t.types, e);
  }
  function Bl(e, t) {
    let r = Object.keys(e).find((n) => xt(n) === t);
    if (r)
      return e[r];
  }
  function Om(e, t) {
    let r = Ot(e);
    for (let o of t)
      switch (o.kind) {
        case "UnknownModel":
          r.arguments.getField(o.modelKey)?.markAsError(), r.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          r.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          r.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), r.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
    let { message: n, args: i } = En(r, "colorless");
    return `Error validating "omit" option:

${i}

${n}`;
  }
  function Ql(e) {
    return e.length === 0 ? Promise.resolve([]) : new Promise((t, r) => {
      let n = new Array(e.length), i = null, o = false, s = 0, a = () => {
        o || (s++, s === e.length && (o = true, i ? r(i) : t(n)));
      }, l = (u) => {
        o || (o = true, r(u));
      };
      for (let u = 0;u < e.length; u++)
        e[u].then((c) => {
          n[u] = c, a();
        }, (c) => {
          if (!Nn(c)) {
            l(c);
            return;
          }
          c.batchRequestIdx === u ? l(c) : (i || (i = c), a());
        });
    });
  }
  function Yl(e) {

    class t {
      constructor(n) {
        this._originalClient = this;
        this._middlewares = new Ln;
        this._createPrismaPromise = po();
        this.$extends = Ia;
        e = n?.__internal?.configOverride?.(e) ?? e, Ba(e), n && Gl(n, e);
        let i = new Kl.EventEmitter().on("error", () => {
        });
        this._extensions = kt.empty(), this._previewFeatures = Fn(e), this._clientVersion = e.clientVersion ?? $l, this._activeProvider = e.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = Il(this._previewFeatures);
        let o = { rootEnvPath: e.relativeEnvPaths.rootEnvPath && Fr.default.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath), schemaEnvPath: e.relativeEnvPaths.schemaEnvPath && Fr.default.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath) }, s;
        if (n?.adapter) {
          s = qi(n.adapter);
          let l = e.activeProvider === "postgresql" ? "postgres" : e.activeProvider;
          if (s.provider !== l)
            throw new R(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${l}\` specified in the Prisma schema.`, this._clientVersion);
          if (n.datasources || n.datasourceUrl !== undefined)
            throw new R("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
        }
        let a = !s && zt(o, { conflictCheck: "none" }) || e.injectableEdgeEnv?.();
        try {
          let l = n ?? {}, u = l.__internal ?? {}, c = u.debug === true;
          c && L.enable("prisma:client");
          let p = Fr.default.resolve(e.dirname, e.relativePath);
          zl.default.existsSync(p) || (p = e.dirname), tt("dirname", e.dirname), tt("relativePath", e.relativePath), tt("cwd", p);
          let d = u.engine || {};
          if (l.errorFormat ? this._errorFormat = l.errorFormat : process.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = e.runtimeDataModel, this._engineConfig = { cwd: p, dirname: e.dirname, enableDebugLogs: c, allowTriggerPanic: d.allowTriggerPanic, datamodelPath: Fr.default.join(e.dirname, e.filename ?? "schema.prisma"), prismaPath: d.binaryPath ?? undefined, engineEndpoint: d.endpoint, generator: e.generator, showColors: this._errorFormat === "pretty", logLevel: l.log && kl(l.log), logQueries: l.log && !!(typeof l.log == "string" ? l.log === "query" : l.log.find((f) => typeof f == "string" ? f === "query" : f.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: e.engineWasm, clientVersion: e.clientVersion, engineVersion: e.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e.activeProvider, inlineSchema: e.inlineSchema, overrideDatasources: Ua(l, e.datasourceNames), inlineDatasources: e.inlineDatasources, inlineSchemaHash: e.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: l.transactionOptions?.maxWait ?? 2000, timeout: l.transactionOptions?.timeout ?? 5000, isolationLevel: l.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: e.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: Nt, getBatchRequestPayload: Ft, prismaGraphQLToJSError: st, PrismaClientUnknownRequestError: B, PrismaClientInitializationError: R, PrismaClientKnownRequestError: V, debug: L("prisma:client:accelerateEngine"), engineVersion: Wl.version, clientVersion: e.clientVersion } }, tt("clientVersion", e.clientVersion), this._engine = hl(e, this._engineConfig), this._requestHandler = new $n(this, i), l.log)
            for (let f of l.log) {
              let g = typeof f == "string" ? f : f.emit === "stdout" ? f.level : null;
              g && this.$on(g, (h) => {
                er.log(`${er.tags[g] ?? ""}`, h.message || h.query);
              });
            }
          this._metrics = new Dt(this._engine);
        } catch (l) {
          throw l.clientVersion = this._clientVersion, l;
        }
        return this._appliedParent = yr(this);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClient";
      }
      $use(n) {
        this._middlewares.use(n);
      }
      $on(n, i) {
        n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i);
      }
      $connect() {
        try {
          return this._engine.start();
        } catch (n) {
          throw n.clientVersion = this._clientVersion, n;
        }
      }
      async $disconnect() {
        try {
          await this._engine.stop();
        } catch (n) {
          throw n.clientVersion = this._clientVersion, n;
        } finally {
          Ao();
        }
      }
      $executeRawInternal(n, i, o, s) {
        let a = this._activeProvider;
        return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: co({ clientMethod: i, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
      }
      $executeRaw(n, ...i) {
        return this._createPrismaPromise((o) => {
          if (n.raw !== undefined || n.sql !== undefined) {
            let [s, a] = Jl(n, i);
            return uo(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
          }
          throw new J("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
        });
      }
      $executeRawUnsafe(n, ...i) {
        return this._createPrismaPromise((o) => (uo(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
      }
      $runCommandRaw(n) {
        if (e.activeProvider !== "mongodb")
          throw new J(`The ${e.activeProvider} provider does not support \$runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
        return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: yl, callsite: Ze(this._errorFormat), transaction: i }));
      }
      async $queryRawInternal(n, i, o, s) {
        let a = this._activeProvider;
        return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: co({ clientMethod: i, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
      }
      $queryRaw(n, ...i) {
        return this._createPrismaPromise((o) => {
          if (n.raw !== undefined || n.sql !== undefined)
            return this.$queryRawInternal(o, "$queryRaw", ...Jl(n, i));
          throw new J("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
        });
      }
      $queryRawTyped(n) {
        return this._createPrismaPromise((i) => {
          if (!this._hasPreviewFlag("typedSql"))
            throw new J("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
          return this.$queryRawInternal(i, "$queryRawTyped", n);
        });
      }
      $queryRawUnsafe(n, ...i) {
        return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
      }
      _transactionWithArray({ promises: n, options: i }) {
        let o = _m.nextId(), s = Ol(n.length), a = n.map((l, u) => {
          if (l?.[Symbol.toStringTag] !== "PrismaPromise")
            throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
          let c = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, p = { kind: "batch", id: o, index: u, isolationLevel: c, lock: s };
          return l.requestTransaction?.(p) ?? l;
        });
        return Ql(a);
      }
      async _transactionWithCallback({ callback: n, options: i }) {
        let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), l;
        try {
          let u = { kind: "itx", ...a };
          l = await n(this._createItxClient(u)), await this._engine.transaction("commit", o, a);
        } catch (u) {
          throw await this._engine.transaction("rollback", o, a).catch(() => {
          }), u;
        }
        return l;
      }
      _createItxClient(n) {
        return yr(Se(Aa(this), [re("_appliedParent", () => this._appliedParent._createItxClient(n)), re("_createPrismaPromise", () => po(n)), re(Dm, () => n.id), _t(vl)]));
      }
      $transaction(n, i) {
        let o;
        typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = () => {
          throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
        } : o = () => this._transactionWithCallback({ callback: n, options: i }) : o = () => this._transactionWithArray({ promises: n, options: i });
        let s = { name: "transaction", attributes: { method: "$transaction" } };
        return this._tracingHelper.runInChildSpan(s, o);
      }
      _request(n) {
        n.otelParentCtx = this._tracingHelper.getActiveContext();
        let i = n.middlewareArgsMapper ?? km, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { middleware: { name: "middleware", middleware: true, attributes: { method: "$use" }, active: false }, operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = -1, l = async (u) => {
          let c = this._middlewares.get(++a);
          if (c)
            return this._tracingHelper.runInChildSpan(s.middleware, (O) => c(u, (T) => (O?.end(), l(T))));
          let { runInTransaction: p, args: d, ...f } = u, g = { ...n, ...f };
          d && (g.args = i.middlewareArgsToRequestArgs(d)), n.transaction !== undefined && p === false && delete g.transaction;
          let h = await Na(this, g);
          return g.model ? Da({ result: h, modelName: g.model, args: g.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : h;
        };
        return this._tracingHelper.runInChildSpan(s.operation, () => new Hl.AsyncResource("prisma-client-request").runInAsyncScope(() => l(o)));
      }
      async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: l, argsMapper: u, transaction: c, unpacker: p, otelParentCtx: d, customDataProxyFetch: f }) {
        try {
          n = u ? u(n) : n;
          let g = { name: "serialize" }, h = this._tracingHelper.runInChildSpan(g, () => vn({ modelName: l, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
          return L.enabled("prisma:client") && (tt("Prisma Client call:"), tt(`prisma.${i}(${ha(n)})`), tt("Generated request:"), tt(JSON.stringify(h, null, 2) + `
`)), c?.kind === "batch" && await c.lock, this._requestHandler.request({ protocolQuery: h, modelName: l, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: c, unpacker: p, otelParentCtx: d, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: f });
        } catch (g) {
          throw g.clientVersion = this._clientVersion, g;
        }
      }
      get $metrics() {
        if (!this._hasPreviewFlag("metrics"))
          throw new J("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: this._clientVersion });
        return this._metrics;
      }
      _hasPreviewFlag(n) {
        return !!this._engineConfig.previewFeatures?.includes(n);
      }
      $applyPendingMigrations() {
        return this._engine.applyPendingMigrations();
      }
    }
    return t;
  }
  function Jl(e, t) {
    return Fm(e) ? [new oe(e, t), Rl] : [e, Cl];
  }
  function Fm(e) {
    return Array.isArray(e) && Array.isArray(e.raw);
  }
  function Zl(e) {
    return new Proxy(e, { get(t, r) {
      if (r in t)
        return t[r];
      if (!Lm.has(r))
        throw new TypeError(`Invalid enum value: ${String(r)}`);
    } });
  }
  function Xl(e) {
    zt(e, { conflictCheck: "warn" });
  }
  var __dirname = "C:\\Users\\Orlando\\OneDrive\\Escritorio\\hono-app-server\\node_modules\\@prisma\\client\\runtime", __filename = "C:\\Users\\Orlando\\OneDrive\\Escritorio\\hono-app-server\\node_modules\\@prisma\\client\\runtime\\library.js";
  var eu = Object.create;
  var Nr = Object.defineProperty;
  var tu = Object.getOwnPropertyDescriptor;
  var ru = Object.getOwnPropertyNames;
  var nu = Object.getPrototypeOf;
  var iu = Object.prototype.hasOwnProperty;
  var Z = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
  var Ut = (e, t) => {
    for (var r in t)
      Nr(e, r, { get: t[r], enumerable: true });
  };
  var ho = (e, t, r, n) => {
    if (t && typeof t == "object" || typeof t == "function")
      for (let i of ru(t))
        !iu.call(e, i) && i !== r && Nr(e, i, { get: () => t[i], enumerable: !(n = tu(t, i)) || n.enumerable });
    return e;
  };
  var k = (e, t, r) => (r = e != null ? eu(nu(e)) : {}, ho(t || !e || !e.__esModule ? Nr(r, "default", { value: e, enumerable: true }) : r, e));
  var ou = (e) => ho(Nr({}, "__esModule", { value: true }), e);
  var jo = Z((pf, Zn) => {
    var v = Zn.exports;
    Zn.exports.default = v;
    var D = "\x1B[", Ht = "\x1B]", ft = "\x07", Jr = ";", qo = false;
    v.cursorTo = (e, t) => {
      if (typeof e != "number")
        throw new TypeError("The `x` argument is required");
      return typeof t != "number" ? D + (e + 1) + "G" : D + (t + 1) + ";" + (e + 1) + "H";
    };
    v.cursorMove = (e, t) => {
      if (typeof e != "number")
        throw new TypeError("The `x` argument is required");
      let r = "";
      return e < 0 ? r += D + -e + "D" : e > 0 && (r += D + e + "C"), t < 0 ? r += D + -t + "A" : t > 0 && (r += D + t + "B"), r;
    };
    v.cursorUp = (e = 1) => D + e + "A";
    v.cursorDown = (e = 1) => D + e + "B";
    v.cursorForward = (e = 1) => D + e + "C";
    v.cursorBackward = (e = 1) => D + e + "D";
    v.cursorLeft = D + "G";
    v.cursorSavePosition = qo ? "\x1B7" : D + "s";
    v.cursorRestorePosition = qo ? "\x1B8" : D + "u";
    v.cursorGetPosition = D + "6n";
    v.cursorNextLine = D + "E";
    v.cursorPrevLine = D + "F";
    v.cursorHide = D + "?25l";
    v.cursorShow = D + "?25h";
    v.eraseLines = (e) => {
      let t = "";
      for (let r = 0;r < e; r++)
        t += v.eraseLine + (r < e - 1 ? v.cursorUp() : "");
      return e && (t += v.cursorLeft), t;
    };
    v.eraseEndLine = D + "K";
    v.eraseStartLine = D + "1K";
    v.eraseLine = D + "2K";
    v.eraseDown = D + "J";
    v.eraseUp = D + "1J";
    v.eraseScreen = D + "2J";
    v.scrollUp = D + "S";
    v.scrollDown = D + "T";
    v.clearScreen = "\x1Bc";
    v.clearTerminal = process.platform === "win32" ? `${v.eraseScreen}${D}0f` : `${v.eraseScreen}${D}3J${D}H`;
    v.beep = ft;
    v.link = (e, t) => [Ht, "8", Jr, Jr, t, ft, e, Ht, "8", Jr, Jr, ft].join("");
    v.image = (e, t = {}) => {
      let r = `${Ht}1337;File=inline=1`;
      return t.width && (r += `;width=${t.width}`), t.height && (r += `;height=${t.height}`), t.preserveAspectRatio === false && (r += ";preserveAspectRatio=0"), r + ":" + e.toString("base64") + ft;
    };
    v.iTerm = { setCwd: (e = process.cwd()) => `${Ht}50;CurrentDir=${e}${ft}`, annotation: (e, t = {}) => {
      let r = `${Ht}1337;`, n = typeof t.x < "u", i = typeof t.y < "u";
      if ((n || i) && !(n && i && typeof t.length < "u"))
        throw new Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
      return e = e.replace(/\|/g, ""), r += t.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", t.length > 0 ? r += (n ? [e, t.length, t.x, t.y] : [t.length, e]).join("|") : r += e, r + ft;
    } };
  });
  var Xn = Z((df, Vo) => {
    Vo.exports = (e, t = process.argv) => {
      let r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
      return n !== -1 && (i === -1 || n < i);
    };
  });
  var Go = Z((mf, Uo) => {
    var Gu = import.meta.require("os"), Bo = import.meta.require("tty"), de = Xn(), { env: Q } = process, Qe;
    de("no-color") || de("no-colors") || de("color=false") || de("color=never") ? Qe = 0 : (de("color") || de("colors") || de("color=true") || de("color=always")) && (Qe = 1);
    "FORCE_COLOR" in Q && (Q.FORCE_COLOR === "true" ? Qe = 1 : Q.FORCE_COLOR === "false" ? Qe = 0 : Qe = Q.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(Q.FORCE_COLOR, 10), 3));
    function ei(e) {
      return e === 0 ? false : { level: e, hasBasic: true, has256: e >= 2, has16m: e >= 3 };
    }
    function ti(e, t) {
      if (Qe === 0)
        return 0;
      if (de("color=16m") || de("color=full") || de("color=truecolor"))
        return 3;
      if (de("color=256"))
        return 2;
      if (e && !t && Qe === undefined)
        return 0;
      let r = Qe || 0;
      if (Q.TERM === "dumb")
        return r;
      if (process.platform === "win32") {
        let n = Gu.release().split(".");
        return Number(n[0]) >= 10 && Number(n[2]) >= 10586 ? Number(n[2]) >= 14931 ? 3 : 2 : 1;
      }
      if ("CI" in Q)
        return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((n) => (n in Q)) || Q.CI_NAME === "codeship" ? 1 : r;
      if ("TEAMCITY_VERSION" in Q)
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(Q.TEAMCITY_VERSION) ? 1 : 0;
      if (Q.COLORTERM === "truecolor")
        return 3;
      if ("TERM_PROGRAM" in Q) {
        let n = parseInt((Q.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (Q.TERM_PROGRAM) {
          case "iTerm.app":
            return n >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      return /-256(color)?$/i.test(Q.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Q.TERM) || ("COLORTERM" in Q) ? 1 : r;
    }
    function Qu(e) {
      let t = ti(e, e && e.isTTY);
      return ei(t);
    }
    Uo.exports = { supportsColor: Qu, stdout: ei(ti(true, Bo.isatty(1))), stderr: ei(ti(true, Bo.isatty(2))) };
  });
  var Wo = Z((ff, Jo) => {
    var Ju = Go(), gt = Xn();
    function Qo(e) {
      if (/^\d{3,4}$/.test(e)) {
        let r = /(\d{1,2})(\d{2})/.exec(e);
        return { major: 0, minor: parseInt(r[1], 10), patch: parseInt(r[2], 10) };
      }
      let t = (e || "").split(".").map((r) => parseInt(r, 10));
      return { major: t[0], minor: t[1], patch: t[2] };
    }
    function ri(e) {
      let { env: t } = process;
      if ("FORCE_HYPERLINK" in t)
        return !(t.FORCE_HYPERLINK.length > 0 && parseInt(t.FORCE_HYPERLINK, 10) === 0);
      if (gt("no-hyperlink") || gt("no-hyperlinks") || gt("hyperlink=false") || gt("hyperlink=never"))
        return false;
      if (gt("hyperlink=true") || gt("hyperlink=always") || "NETLIFY" in t)
        return true;
      if (!Ju.supportsColor(e) || e && !e.isTTY || process.platform === "win32" || "CI" in t || "TEAMCITY_VERSION" in t)
        return false;
      if ("TERM_PROGRAM" in t) {
        let r = Qo(t.TERM_PROGRAM_VERSION);
        switch (t.TERM_PROGRAM) {
          case "iTerm.app":
            return r.major === 3 ? r.minor >= 1 : r.major > 3;
          case "WezTerm":
            return r.major >= 20200620;
          case "vscode":
            return r.major > 1 || r.major === 1 && r.minor >= 72;
        }
      }
      if ("VTE_VERSION" in t) {
        if (t.VTE_VERSION === "0.50.0")
          return false;
        let r = Qo(t.VTE_VERSION);
        return r.major > 0 || r.minor >= 50;
      }
      return false;
    }
    Jo.exports = { supportsHyperlink: ri, stdout: ri(process.stdout), stderr: ri(process.stderr) };
  });
  var Ko = Z((gf, Kt) => {
    var Wu = jo(), ni = Wo(), Ho = (e, t, { target: r = "stdout", ...n } = {}) => ni[r] ? Wu.link(e, t) : n.fallback === false ? e : typeof n.fallback == "function" ? n.fallback(e, t) : `${e} (\u200B${t}\u200B)`;
    Kt.exports = (e, t, r = {}) => Ho(e, t, r);
    Kt.exports.stderr = (e, t, r = {}) => Ho(e, t, { target: "stderr", ...r });
    Kt.exports.isSupported = ni.stdout;
    Kt.exports.stderr.isSupported = ni.stderr;
  });
  var oi = Z((Rf, Hu) => {
    Hu.exports = { name: "@prisma/engines-version", version: "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "605197351a3c8bdd595af2d2a9bc3025bca48ea2" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.34", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
  });
  var si = Z((Wr) => {
    Object.defineProperty(Wr, "__esModule", { value: true });
    Wr.enginesVersion = undefined;
    Wr.enginesVersion = oi().prisma.enginesVersion;
  });
  var Xo = Z((Gf, Yu) => {
    Yu.exports = { name: "dotenv", version: "16.0.3", description: "Loads environment variables from .env file", main: "lib/main.js", types: "lib/main.d.ts", exports: { ".": { require: "./lib/main.js", types: "./lib/main.d.ts", default: "./lib/main.js" }, "./config": "./config.js", "./config.js": "./config.js", "./lib/env-options": "./lib/env-options.js", "./lib/env-options.js": "./lib/env-options.js", "./lib/cli-options": "./lib/cli-options.js", "./lib/cli-options.js": "./lib/cli-options.js", "./package.json": "./package.json" }, scripts: { "dts-check": "tsc --project tests/types/tsconfig.json", lint: "standard", "lint-readme": "standard-markdown", pretest: "npm run lint && npm run dts-check", test: "tap tests/*.js --100 -Rspec", prerelease: "npm test", release: "standard-version" }, repository: { type: "git", url: "git://github.com/motdotla/dotenv.git" }, keywords: ["dotenv", "env", ".env", "environment", "variables", "config", "settings"], readmeFilename: "README.md", license: "BSD-2-Clause", devDependencies: { "@types/node": "^17.0.9", decache: "^4.6.1", dtslint: "^3.7.0", sinon: "^12.0.1", standard: "^16.0.4", "standard-markdown": "^7.1.0", "standard-version": "^9.3.2", tap: "^15.1.6", tar: "^6.1.11", typescript: "^4.5.4" }, engines: { node: ">=12" } };
  });
  var ts = Z((Qf, Kr) => {
    var Zu = import.meta.require("fs"), es = import.meta.require("path"), Xu = import.meta.require("os"), ec = Xo(), tc = ec.version, rc = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function nc(e) {
      let t = {}, r = e.toString();
      r = r.replace(/\r\n?/mg, `
`);
      let n;
      for (;(n = rc.exec(r)) != null; ) {
        let i = n[1], o = n[2] || "";
        o = o.trim();
        let s = o[0];
        o = o.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), s === '"' && (o = o.replace(/\\n/g, `
`), o = o.replace(/\\r/g, "\r")), t[i] = o;
      }
      return t;
    }
    function ci(e) {
      console.log(`[dotenv@${tc}][DEBUG] ${e}`);
    }
    function ic(e) {
      return e[0] === "~" ? es.join(Xu.homedir(), e.slice(1)) : e;
    }
    function oc(e) {
      let t = es.resolve(process.cwd(), ".env"), r = "utf8", n = !!(e && e.debug), i = !!(e && e.override);
      e && (e.path != null && (t = ic(e.path)), e.encoding != null && (r = e.encoding));
      try {
        let o = Hr.parse(Zu.readFileSync(t, { encoding: r }));
        return Object.keys(o).forEach(function(s) {
          Object.prototype.hasOwnProperty.call(process.env, s) ? (i === true && (process.env[s] = o[s]), n && ci(i === true ? `"${s}" is already defined in \`process.env\` and WAS overwritten` : `"${s}" is already defined in \`process.env\` and was NOT overwritten`)) : process.env[s] = o[s];
        }), { parsed: o };
      } catch (o) {
        return n && ci(`Failed to load ${t} ${o.message}`), { error: o };
      }
    }
    var Hr = { config: oc, parse: nc };
    Kr.exports.config = Hr.config;
    Kr.exports.parse = Hr.parse;
    Kr.exports = Hr;
  });
  var as = Z((Zf, ss) => {
    ss.exports = (e) => {
      let t = e.match(/^[ \t]*(?=\S)/gm);
      return t ? t.reduce((r, n) => Math.min(r, n.length), 1 / 0) : 0;
    };
  });
  var us = Z((Xf, ls) => {
    var uc = as();
    ls.exports = (e) => {
      let t = uc(e);
      if (t === 0)
        return e;
      let r = new RegExp(`^[ \\t]{${t}}`, "gm");
      return e.replace(r, "");
    };
  });
  var fi = Z((og, cs) => {
    cs.exports = (e, t = 1, r) => {
      if (r = { indent: " ", includeEmptyLines: false, ...r }, typeof e != "string")
        throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);
      if (typeof t != "number")
        throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof t}\``);
      if (typeof r.indent != "string")
        throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``);
      if (t === 0)
        return e;
      let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
      return e.replace(n, r.indent.repeat(t));
    };
  });
  var fs = Z((lg, ms) => {
    ms.exports = ({ onlyFirst: e = false } = {}) => {
      let t = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
      return new RegExp(t, e ? undefined : "g");
    };
  });
  var bi = Z((ug, gs) => {
    var yc = fs();
    gs.exports = (e) => typeof e == "string" ? e.replace(yc(), "") : e;
  });
  var hs = Z((dg, Zr) => {
    Zr.exports = (e = {}) => {
      let t;
      if (e.repoUrl)
        t = e.repoUrl;
      else if (e.user && e.repo)
        t = `https://github.com/${e.user}/${e.repo}`;
      else
        throw new Error("You need to specify either the `repoUrl` option or both the `user` and `repo` options");
      let r = new URL(`${t}/issues/new`), n = ["body", "title", "labels", "template", "milestone", "assignee", "projects"];
      for (let i of n) {
        let o = e[i];
        if (o !== undefined) {
          if (i === "labels" || i === "projects") {
            if (!Array.isArray(o))
              throw new TypeError(`The \`${i}\` option should be an array`);
            o = o.join(",");
          }
          r.searchParams.set(i, o);
        }
      }
      return r.toString();
    };
    Zr.exports.default = Zr.exports;
  });
  var Ai = Z((Th, $s) => {
    $s.exports = function() {
      function e(t, r, n, i, o) {
        return t < r || n < r ? t > n ? n + 1 : t + 1 : i === o ? r : r + 1;
      }
      return function(t, r) {
        if (t === r)
          return 0;
        if (t.length > r.length) {
          var n = t;
          t = r, r = n;
        }
        for (var i = t.length, o = r.length;i > 0 && t.charCodeAt(i - 1) === r.charCodeAt(o - 1); )
          i--, o--;
        for (var s = 0;s < i && t.charCodeAt(s) === r.charCodeAt(s); )
          s++;
        if (i -= s, o -= s, i === 0 || o < 3)
          return o;
        var a = 0, l, u, c, p, d, f, g, h, O, T, S, C, E = [];
        for (l = 0;l < i; l++)
          E.push(l + 1), E.push(t.charCodeAt(s + l));
        for (var me = E.length - 1;a < o - 3; )
          for (O = r.charCodeAt(s + (u = a)), T = r.charCodeAt(s + (c = a + 1)), S = r.charCodeAt(s + (p = a + 2)), C = r.charCodeAt(s + (d = a + 3)), f = a += 4, l = 0;l < me; l += 2)
            g = E[l], h = E[l + 1], u = e(g, u, c, O, h), c = e(u, c, p, T, h), p = e(c, p, d, S, h), f = e(p, d, f, C, h), E[l] = f, d = p, p = c, c = u, u = g;
        for (;a < o; )
          for (O = r.charCodeAt(s + (u = a)), f = ++a, l = 0;l < me; l += 2)
            g = E[l], E[l] = f = e(g, u, f, O, E[l + 1]), u = g;
        return f;
      };
    }();
  });
  var Nm = {};
  Ut(Nm, { Debug: () => Gn, Decimal: () => xe, Extensions: () => jn, MetricsClient: () => Dt, NotFoundError: () => Le, PrismaClientInitializationError: () => R, PrismaClientKnownRequestError: () => V, PrismaClientRustPanicError: () => le, PrismaClientUnknownRequestError: () => B, PrismaClientValidationError: () => J, Public: () => Vn, Sql: () => oe, defineDmmfProperty: () => ua, deserializeJsonResponse: () => wt, dmmfToRuntimeDataModel: () => la, empty: () => ma, getPrismaClient: () => Yl, getRuntime: () => In, join: () => da, makeStrictEnum: () => Zl, makeTypedQueryFactory: () => ca, objectEnumValues: () => yn, raw: () => ji, serializeJsonQuery: () => vn, skip: () => Pn, sqltag: () => Vi, warnEnvConflicts: () => Xl, warnOnce: () => tr });
  module.exports = ou(Nm);
  var jn = {};
  Ut(jn, { defineExtension: () => yo, getExtensionContext: () => bo });
  var Vn = {};
  Ut(Vn, { validator: () => Eo });
  var Mr = {};
  Ut(Mr, { $: () => To, bgBlack: () => gu, bgBlue: () => Eu, bgCyan: () => xu, bgGreen: () => yu, bgMagenta: () => wu, bgRed: () => hu, bgWhite: () => Pu, bgYellow: () => bu, black: () => pu, blue: () => rt, bold: () => H, cyan: () => De, dim: () => Oe, gray: () => Gt, green: () => qe, grey: () => fu, hidden: () => uu, inverse: () => lu, italic: () => au, magenta: () => du, red: () => ce, reset: () => su, strikethrough: () => cu, underline: () => X, white: () => mu, yellow: () => ke });
  var Bn;
  var wo;
  var xo;
  var Po;
  var vo = true;
  typeof process < "u" && ({ FORCE_COLOR: Bn, NODE_DISABLE_COLORS: wo, NO_COLOR: xo, TERM: Po } = process.env || {}, vo = process.stdout && process.stdout.isTTY);
  var To = { enabled: !wo && xo == null && Po !== "dumb" && (Bn != null && Bn !== "0" || vo) };
  var su = M(0, 0);
  var H = M(1, 22);
  var Oe = M(2, 22);
  var au = M(3, 23);
  var X = M(4, 24);
  var lu = M(7, 27);
  var uu = M(8, 28);
  var cu = M(9, 29);
  var pu = M(30, 39);
  var ce = M(31, 39);
  var qe = M(32, 39);
  var ke = M(33, 39);
  var rt = M(34, 39);
  var du = M(35, 39);
  var De = M(36, 39);
  var mu = M(37, 39);
  var Gt = M(90, 39);
  var fu = M(90, 39);
  var gu = M(40, 49);
  var hu = M(41, 49);
  var yu = M(42, 49);
  var bu = M(43, 49);
  var Eu = M(44, 49);
  var wu = M(45, 49);
  var xu = M(46, 49);
  var Pu = M(47, 49);
  var vu = 100;
  var Ro = ["green", "yellow", "blue", "magenta", "cyan", "red"];
  var Qt = [];
  var Co = Date.now();
  var Tu = 0;
  var Un = typeof process < "u" ? process.env : {};
  globalThis.DEBUG ??= Un.DEBUG ?? "";
  globalThis.DEBUG_COLORS ??= Un.DEBUG_COLORS ? Un.DEBUG_COLORS === "true" : true;
  var Jt = { enable(e) {
    typeof e == "string" && (globalThis.DEBUG = e);
  }, disable() {
    let e = globalThis.DEBUG;
    return globalThis.DEBUG = "", e;
  }, enabled(e) {
    let t = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), r = t.some((i) => i === "" || i[0] === "-" ? false : e.match(RegExp(i.split("*").join(".*") + "$"))), n = t.some((i) => i === "" || i[0] !== "-" ? false : e.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
    return r && !n;
  }, log: (...e) => {
    let [t, r, ...n] = e;
    (console.warn ?? console.log)(`${t} ${r}`, ...n);
  }, formatters: {} };
  var Gn = new Proxy(Ru, { get: (e, t) => Jt[t], set: (e, t, r) => Jt[t] = r });
  var L = Gn;
  var Io = k(import.meta.require("fs"));
  var Jn = ["darwin", "darwin-arm64", "debian-openssl-1.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-1.1.x", "rhel-openssl-3.0.x", "linux-arm64-openssl-1.1.x", "linux-arm64-openssl-1.0.x", "linux-arm64-openssl-3.0.x", "linux-arm-openssl-1.1.x", "linux-arm-openssl-1.0.x", "linux-arm-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-1.1.x", "linux-musl-arm64-openssl-3.0.x", "linux-nixos", "linux-static-x64", "linux-static-arm64", "windows", "freebsd11", "freebsd12", "freebsd13", "freebsd14", "freebsd15", "openbsd", "netbsd", "arm"];
  var $r = "libquery_engine";
  var _o = k(import.meta.require("child_process"));
  var zn = k(import.meta.require("fs/promises"));
  var Gr = k(import.meta.require("os"));
  var _e = Symbol.for("@ts-pattern/matcher");
  var Su = Symbol.for("@ts-pattern/isVariadic");
  var Vr = "@ts-pattern/anonymous-select-key";
  var Wn = (e) => !!(e && typeof e == "object");
  var jr = (e) => e && !!e[_e];
  var Ee = (e, t, r) => {
    if (jr(e)) {
      let n = e[_e](), { matched: i, selections: o } = n.match(t);
      return i && o && Object.keys(o).forEach((s) => r(s, o[s])), i;
    }
    if (Wn(e)) {
      if (!Wn(t))
        return false;
      if (Array.isArray(e)) {
        if (!Array.isArray(t))
          return false;
        let n = [], i = [], o = [];
        for (let s of e.keys()) {
          let a = e[s];
          jr(a) && a[Su] ? o.push(a) : o.length ? i.push(a) : n.push(a);
        }
        if (o.length) {
          if (o.length > 1)
            throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
          if (t.length < n.length + i.length)
            return false;
          let s = t.slice(0, n.length), a = i.length === 0 ? [] : t.slice(-i.length), l = t.slice(n.length, i.length === 0 ? 1 / 0 : -i.length);
          return n.every((u, c) => Ee(u, s[c], r)) && i.every((u, c) => Ee(u, a[c], r)) && (o.length === 0 || Ee(o[0], l, r));
        }
        return e.length === t.length && e.every((s, a) => Ee(s, t[a], r));
      }
      return Object.keys(e).every((n) => {
        let i = e[n];
        return ((n in t) || jr(o = i) && o[_e]().matcherType === "optional") && Ee(i, t[n], r);
        var o;
      });
    }
    return Object.is(t, e);
  };
  var Ge = (e) => {
    var t, r, n;
    return Wn(e) ? jr(e) ? (t = (r = (n = e[_e]()).getSelectionKeys) == null ? undefined : r.call(n)) != null ? t : [] : Array.isArray(e) ? Wt(e, Ge) : Wt(Object.values(e), Ge) : [];
  };
  var Wt = (e, t) => e.reduce((r, n) => r.concat(t(n)), []);
  var Km = pe(I(function(e) {
    return true;
  }));
  var Be = (e) => Object.assign(pe(e), { startsWith: (t) => {
    return Be(j(e, (r = t, I((n) => je(n) && n.startsWith(r)))));
    var r;
  }, endsWith: (t) => {
    return Be(j(e, (r = t, I((n) => je(n) && n.endsWith(r)))));
    var r;
  }, minLength: (t) => Be(j(e, ((r) => I((n) => je(n) && n.length >= r))(t))), length: (t) => Be(j(e, ((r) => I((n) => je(n) && n.length === r))(t))), maxLength: (t) => Be(j(e, ((r) => I((n) => je(n) && n.length <= r))(t))), includes: (t) => {
    return Be(j(e, (r = t, I((n) => je(n) && n.includes(r)))));
    var r;
  }, regex: (t) => {
    return Be(j(e, (r = t, I((n) => je(n) && !!n.match(r)))));
    var r;
  } });
  var zm = Be(I(je));
  var be = (e) => Object.assign(pe(e), { between: (t, r) => be(j(e, ((n, i) => I((o) => ye(o) && n <= o && i >= o))(t, r))), lt: (t) => be(j(e, ((r) => I((n) => ye(n) && n < r))(t))), gt: (t) => be(j(e, ((r) => I((n) => ye(n) && n > r))(t))), lte: (t) => be(j(e, ((r) => I((n) => ye(n) && n <= r))(t))), gte: (t) => be(j(e, ((r) => I((n) => ye(n) && n >= r))(t))), int: () => be(j(e, I((t) => ye(t) && Number.isInteger(t)))), finite: () => be(j(e, I((t) => ye(t) && Number.isFinite(t)))), positive: () => be(j(e, I((t) => ye(t) && t > 0))), negative: () => be(j(e, I((t) => ye(t) && t < 0))) });
  var Ym = be(I(ye));
  var Ue = (e) => Object.assign(pe(e), { between: (t, r) => Ue(j(e, ((n, i) => I((o) => Ve(o) && n <= o && i >= o))(t, r))), lt: (t) => Ue(j(e, ((r) => I((n) => Ve(n) && n < r))(t))), gt: (t) => Ue(j(e, ((r) => I((n) => Ve(n) && n > r))(t))), lte: (t) => Ue(j(e, ((r) => I((n) => Ve(n) && n <= r))(t))), gte: (t) => Ue(j(e, ((r) => I((n) => Ve(n) && n >= r))(t))), positive: () => Ue(j(e, I((t) => Ve(t) && t > 0))), negative: () => Ue(j(e, I((t) => Ve(t) && t < 0))) });
  var Zm = Ue(I(Ve));
  var Xm = pe(I(function(e) {
    return typeof e == "boolean";
  }));
  var ef = pe(I(function(e) {
    return typeof e == "symbol";
  }));
  var tf = pe(I(function(e) {
    return e == null;
  }));
  var rf = pe(I(function(e) {
    return e != null;
  }));
  var Hn = { matched: false, value: undefined };
  var Kn = class e {
    constructor(t, r) {
      this.input = undefined, this.state = undefined, this.input = t, this.state = r;
    }
    with(...t) {
      if (this.state.matched)
        return this;
      let r = t[t.length - 1], n = [t[0]], i;
      t.length === 3 && typeof t[1] == "function" ? i = t[1] : t.length > 2 && n.push(...t.slice(1, t.length - 1));
      let o = false, s = {}, a = (u, c) => {
        o = true, s[u] = c;
      }, l = !n.some((u) => Ee(u, this.input, a)) || i && !i(this.input) ? Hn : { matched: true, value: r(o ? Vr in s ? s[Vr] : s : this.input, this.input) };
      return new e(this.input, l);
    }
    when(t, r) {
      if (this.state.matched)
        return this;
      let n = !!t(this.input);
      return new e(this.input, n ? { matched: true, value: r(this.input, this.input) } : Hn);
    }
    otherwise(t) {
      return this.state.matched ? this.state.value : t(this.input);
    }
    exhaustive() {
      if (this.state.matched)
        return this.state.value;
      let t;
      try {
        t = JSON.stringify(this.input);
      } catch {
        t = this.input;
      }
      throw new Error(`Pattern matching error: no pattern matches value ${t}`);
    }
    run() {
      return this.exhaustive();
    }
    returnType() {
      return this;
    }
  };
  var Fo = import.meta.require("util");
  var Ou = { warn: ke("prisma:warn") };
  var ku = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
  var Du = (0, Fo.promisify)(_o.default.exec);
  var te = L("prisma:get-platform");
  var _u = ["1.0.x", "1.1.x", "3.0.x"];
  var Ur = {};
  var zo = k(Ko());
  var Ku = k(si());
  var $ = k(import.meta.require("path"));
  var zu = k(si());
  var Lf = L("prisma:engines");
  var Nf = "libquery-engine";
  $.default.join(__dirname, "../query-engine-darwin");
  $.default.join(__dirname, "../query-engine-darwin-arm64");
  $.default.join(__dirname, "../query-engine-debian-openssl-1.0.x");
  $.default.join(__dirname, "../query-engine-debian-openssl-1.1.x");
  $.default.join(__dirname, "../query-engine-debian-openssl-3.0.x");
  $.default.join(__dirname, "../query-engine-linux-static-x64");
  $.default.join(__dirname, "../query-engine-linux-static-arm64");
  $.default.join(__dirname, "../query-engine-rhel-openssl-1.0.x");
  $.default.join(__dirname, "../query-engine-rhel-openssl-1.1.x");
  $.default.join(__dirname, "../query-engine-rhel-openssl-3.0.x");
  $.default.join(__dirname, "../libquery_engine-darwin.dylib.node");
  $.default.join(__dirname, "../libquery_engine-darwin-arm64.dylib.node");
  $.default.join(__dirname, "../libquery_engine-debian-openssl-1.0.x.so.node");
  $.default.join(__dirname, "../libquery_engine-debian-openssl-1.1.x.so.node");
  $.default.join(__dirname, "../libquery_engine-debian-openssl-3.0.x.so.node");
  $.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.0.x.so.node");
  $.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.1.x.so.node");
  $.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-3.0.x.so.node");
  $.default.join(__dirname, "../libquery_engine-linux-musl.so.node");
  $.default.join(__dirname, "../libquery_engine-linux-musl-openssl-3.0.x.so.node");
  $.default.join(__dirname, "../libquery_engine-rhel-openssl-1.0.x.so.node");
  $.default.join(__dirname, "../libquery_engine-rhel-openssl-1.1.x.so.node");
  $.default.join(__dirname, "../libquery_engine-rhel-openssl-3.0.x.so.node");
  $.default.join(__dirname, "../query_engine-windows.dll.node");
  var ai = k(import.meta.require("fs"));
  var Zo = L("chmodPlusX");
  var di = k(ts());
  var zr = k(import.meta.require("fs"));
  var ht = k(import.meta.require("path"));
  var pi = L("prisma:tryLoadEnv");
  var os = "library";
  var Je;
  ((t) => {
    let e;
    ((E) => (E.findUnique = "findUnique", E.findUniqueOrThrow = "findUniqueOrThrow", E.findFirst = "findFirst", E.findFirstOrThrow = "findFirstOrThrow", E.findMany = "findMany", E.create = "create", E.createMany = "createMany", E.createManyAndReturn = "createManyAndReturn", E.update = "update", E.updateMany = "updateMany", E.upsert = "upsert", E.delete = "delete", E.deleteMany = "deleteMany", E.groupBy = "groupBy", E.count = "count", E.aggregate = "aggregate", E.findRaw = "findRaw", E.aggregateRaw = "aggregateRaw"))(e = t.ModelAction ||= {});
  })(Je ||= {});
  var Zt = k(import.meta.require("path"));
  var ps = k(fi());
  var gi = class {
    constructor(t) {
      this.config = t;
    }
    toString() {
      let { config: t } = this, r = t.provider.fromEnvVar ? `env("${t.provider.fromEnvVar}")` : t.provider.value, n = JSON.parse(JSON.stringify({ provider: r, binaryTargets: cc(t.binaryTargets) }));
      return `generator ${t.name} {
${(0, ps.default)(pc(n), 2)}
}`;
    }
  };
  var er = {};
  Ut(er, { error: () => gc, info: () => fc, log: () => mc, query: () => hc, should: () => ds, tags: () => Xt, warn: () => yi });
  var Xt = { error: ce("prisma:error"), warn: ke("prisma:warn"), info: De("prisma:info"), query: rt("prisma:query") };
  var ds = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
  var wi = (e, t) => e.reduce((r, n) => (r[t(n)] = n, r), {});
  var ys = new Set;
  var tr = (e, t, ...r) => {
    ys.has(e) || (ys.add(e), yi(t, ...r));
  };
  var V = class extends Error {
    constructor(t, { code: r, clientVersion: n, meta: i, batchRequestIdx: o }) {
      super(t), this.name = "PrismaClientKnownRequestError", this.code = r, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientKnownRequestError";
    }
  };
  w(V, "PrismaClientKnownRequestError");
  var Le = class extends V {
    constructor(t, r) {
      super(t, { code: "P2025", clientVersion: r }), this.name = "NotFoundError";
    }
  };
  w(Le, "NotFoundError");
  var R = class e extends Error {
    constructor(t, r, n) {
      super(t), this.name = "PrismaClientInitializationError", this.clientVersion = r, this.errorCode = n, Error.captureStackTrace(e);
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientInitializationError";
    }
  };
  w(R, "PrismaClientInitializationError");
  var le = class extends Error {
    constructor(t, r) {
      super(t), this.name = "PrismaClientRustPanicError", this.clientVersion = r;
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientRustPanicError";
    }
  };
  w(le, "PrismaClientRustPanicError");
  var B = class extends Error {
    constructor(t, { clientVersion: r, batchRequestIdx: n }) {
      super(t), this.name = "PrismaClientUnknownRequestError", this.clientVersion = r, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientUnknownRequestError";
    }
  };
  w(B, "PrismaClientUnknownRequestError");
  var J = class extends Error {
    constructor(r, { clientVersion: n }) {
      super(r);
      this.name = "PrismaClientValidationError";
      this.clientVersion = n;
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientValidationError";
    }
  };
  w(J, "PrismaClientValidationError");
  var bt = 9000000000000000;
  var ze = 1e9;
  var Pi = "0123456789abcdef";
  var tn = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
  var rn = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
  var vi = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -bt, maxE: bt, crypto: false };
  var xs;
  var Ne;
  var x = true;
  var on = "[DecimalError] ";
  var Ke = on + "Invalid argument: ";
  var Ps = on + "Precision limit exceeded";
  var vs = on + "crypto unavailable";
  var Ts = "[object Decimal]";
  var ee = Math.floor;
  var G = Math.pow;
  var bc = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
  var Ec = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
  var wc = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
  var Rs = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  var ge = 1e7;
  var b = 7;
  var xc = 9007199254740991;
  var Pc = tn.length - 1;
  var Ti = rn.length - 1;
  var m = { toStringTag: Ts };
  m.absoluteValue = m.abs = function() {
    var e = new this.constructor(this);
    return e.s < 0 && (e.s = 1), y(e);
  };
  m.ceil = function() {
    return y(new this.constructor(this), this.e + 1, 2);
  };
  m.clampedTo = m.clamp = function(e, t) {
    var r, n = this, i = n.constructor;
    if (e = new i(e), t = new i(t), !e.s || !t.s)
      return new i(NaN);
    if (e.gt(t))
      throw Error(Ke + t);
    return r = n.cmp(e), r < 0 ? e : n.cmp(t) > 0 ? t : new i(n);
  };
  m.comparedTo = m.cmp = function(e) {
    var t, r, n, i, o = this, s = o.d, a = (e = new o.constructor(e)).d, l = o.s, u = e.s;
    if (!s || !a)
      return !l || !u ? NaN : l !== u ? l : s === a ? 0 : !s ^ l < 0 ? 1 : -1;
    if (!s[0] || !a[0])
      return s[0] ? l : a[0] ? -u : 0;
    if (l !== u)
      return l;
    if (o.e !== e.e)
      return o.e > e.e ^ l < 0 ? 1 : -1;
    for (n = s.length, i = a.length, t = 0, r = n < i ? n : i;t < r; ++t)
      if (s[t] !== a[t])
        return s[t] > a[t] ^ l < 0 ? 1 : -1;
    return n === i ? 0 : n > i ^ l < 0 ? 1 : -1;
  };
  m.cosine = m.cos = function() {
    var e, t, r = this, n = r.constructor;
    return r.d ? r.d[0] ? (e = n.precision, t = n.rounding, n.precision = e + Math.max(r.e, r.sd()) + b, n.rounding = 1, r = vc(n, Os(n, r)), n.precision = e, n.rounding = t, y(Ne == 2 || Ne == 3 ? r.neg() : r, e, t, true)) : new n(1) : new n(NaN);
  };
  m.cubeRoot = m.cbrt = function() {
    var e, t, r, n, i, o, s, a, l, u, c = this, p = c.constructor;
    if (!c.isFinite() || c.isZero())
      return new p(c);
    for (x = false, o = c.s * G(c.s * c, 1 / 3), !o || Math.abs(o) == 1 / 0 ? (r = K(c.d), e = c.e, (o = (e - r.length + 1) % 3) && (r += o == 1 || o == -2 ? "0" : "00"), o = G(r, 1 / 3), e = ee((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), o == 1 / 0 ? r = "5e" + e : (r = o.toExponential(), r = r.slice(0, r.indexOf("e") + 1) + e), n = new p(r), n.s = c.s) : n = new p(o.toString()), s = (e = p.precision) + 3;; )
      if (a = n, l = a.times(a).times(a), u = l.plus(c), n = N(u.plus(c).times(a), u.plus(l), s + 2, 1), K(a.d).slice(0, s) === (r = K(n.d)).slice(0, s))
        if (r = r.slice(s - 3, s + 1), r == "9999" || !i && r == "4999") {
          if (!i && (y(a, e + 1, 0), a.times(a).times(a).eq(c))) {
            n = a;
            break;
          }
          s += 4, i = 1;
        } else {
          (!+r || !+r.slice(1) && r.charAt(0) == "5") && (y(n, e + 1, 1), t = !n.times(n).times(n).eq(c));
          break;
        }
    return x = true, y(n, e, p.rounding, t);
  };
  m.decimalPlaces = m.dp = function() {
    var e, t = this.d, r = NaN;
    if (t) {
      if (e = t.length - 1, r = (e - ee(this.e / b)) * b, e = t[e], e)
        for (;e % 10 == 0; e /= 10)
          r--;
      r < 0 && (r = 0);
    }
    return r;
  };
  m.dividedBy = m.div = function(e) {
    return N(this, new this.constructor(e));
  };
  m.dividedToIntegerBy = m.divToInt = function(e) {
    var t = this, r = t.constructor;
    return y(N(t, new r(e), 0, 1, 1), r.precision, r.rounding);
  };
  m.equals = m.eq = function(e) {
    return this.cmp(e) === 0;
  };
  m.floor = function() {
    return y(new this.constructor(this), this.e + 1, 3);
  };
  m.greaterThan = m.gt = function(e) {
    return this.cmp(e) > 0;
  };
  m.greaterThanOrEqualTo = m.gte = function(e) {
    var t = this.cmp(e);
    return t == 1 || t === 0;
  };
  m.hyperbolicCosine = m.cosh = function() {
    var e, t, r, n, i, o = this, s = o.constructor, a = new s(1);
    if (!o.isFinite())
      return new s(o.s ? 1 / 0 : NaN);
    if (o.isZero())
      return a;
    r = s.precision, n = s.rounding, s.precision = r + Math.max(o.e, o.sd()) + 4, s.rounding = 1, i = o.d.length, i < 32 ? (e = Math.ceil(i / 3), t = (1 / an(4, e)).toString()) : (e = 16, t = "2.3283064365386962890625e-10"), o = Et(s, 1, o.times(t), new s(1), true);
    for (var l, u = e, c = new s(8);u--; )
      l = o.times(o), o = a.minus(l.times(c.minus(l.times(c))));
    return y(o, s.precision = r, s.rounding = n, true);
  };
  m.hyperbolicSine = m.sinh = function() {
    var e, t, r, n, i = this, o = i.constructor;
    if (!i.isFinite() || i.isZero())
      return new o(i);
    if (t = o.precision, r = o.rounding, o.precision = t + Math.max(i.e, i.sd()) + 4, o.rounding = 1, n = i.d.length, n < 3)
      i = Et(o, 2, i, i, true);
    else {
      e = 1.4 * Math.sqrt(n), e = e > 16 ? 16 : e | 0, i = i.times(1 / an(5, e)), i = Et(o, 2, i, i, true);
      for (var s, a = new o(5), l = new o(16), u = new o(20);e--; )
        s = i.times(i), i = i.times(a.plus(s.times(l.times(s).plus(u))));
    }
    return o.precision = t, o.rounding = r, y(i, t, r, true);
  };
  m.hyperbolicTangent = m.tanh = function() {
    var e, t, r = this, n = r.constructor;
    return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 7, n.rounding = 1, N(r.sinh(), r.cosh(), n.precision = e, n.rounding = t)) : new n(r.s);
  };
  m.inverseCosine = m.acos = function() {
    var e, t = this, r = t.constructor, n = t.abs().cmp(1), i = r.precision, o = r.rounding;
    return n !== -1 ? n === 0 ? t.isNeg() ? fe(r, i, o) : new r(0) : new r(NaN) : t.isZero() ? fe(r, i + 4, o).times(0.5) : (r.precision = i + 6, r.rounding = 1, t = t.asin(), e = fe(r, i + 4, o).times(0.5), r.precision = i, r.rounding = o, e.minus(t));
  };
  m.inverseHyperbolicCosine = m.acosh = function() {
    var e, t, r = this, n = r.constructor;
    return r.lte(1) ? new n(r.eq(1) ? 0 : NaN) : r.isFinite() ? (e = n.precision, t = n.rounding, n.precision = e + Math.max(Math.abs(r.e), r.sd()) + 4, n.rounding = 1, x = false, r = r.times(r).minus(1).sqrt().plus(r), x = true, n.precision = e, n.rounding = t, r.ln()) : new n(r);
  };
  m.inverseHyperbolicSine = m.asinh = function() {
    var e, t, r = this, n = r.constructor;
    return !r.isFinite() || r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 2 * Math.max(Math.abs(r.e), r.sd()) + 6, n.rounding = 1, x = false, r = r.times(r).plus(1).sqrt().plus(r), x = true, n.precision = e, n.rounding = t, r.ln());
  };
  m.inverseHyperbolicTangent = m.atanh = function() {
    var e, t, r, n, i = this, o = i.constructor;
    return i.isFinite() ? i.e >= 0 ? new o(i.abs().eq(1) ? i.s / 0 : i.isZero() ? i : NaN) : (e = o.precision, t = o.rounding, n = i.sd(), Math.max(n, e) < 2 * -i.e - 1 ? y(new o(i), e, t, true) : (o.precision = r = n - i.e, i = N(i.plus(1), new o(1).minus(i), r + e, 1), o.precision = e + 4, o.rounding = 1, i = i.ln(), o.precision = e, o.rounding = t, i.times(0.5))) : new o(NaN);
  };
  m.inverseSine = m.asin = function() {
    var e, t, r, n, i = this, o = i.constructor;
    return i.isZero() ? new o(i) : (t = i.abs().cmp(1), r = o.precision, n = o.rounding, t !== -1 ? t === 0 ? (e = fe(o, r + 4, n).times(0.5), e.s = i.s, e) : new o(NaN) : (o.precision = r + 6, o.rounding = 1, i = i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan(), o.precision = r, o.rounding = n, i.times(2)));
  };
  m.inverseTangent = m.atan = function() {
    var e, t, r, n, i, o, s, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding;
    if (u.isFinite()) {
      if (u.isZero())
        return new c(u);
      if (u.abs().eq(1) && p + 4 <= Ti)
        return s = fe(c, p + 4, d).times(0.25), s.s = u.s, s;
    } else {
      if (!u.s)
        return new c(NaN);
      if (p + 4 <= Ti)
        return s = fe(c, p + 4, d).times(0.5), s.s = u.s, s;
    }
    for (c.precision = a = p + 10, c.rounding = 1, r = Math.min(28, a / b + 2 | 0), e = r;e; --e)
      u = u.div(u.times(u).plus(1).sqrt().plus(1));
    for (x = false, t = Math.ceil(a / b), n = 1, l = u.times(u), s = new c(u), i = u;e !== -1; )
      if (i = i.times(l), o = s.minus(i.div(n += 2)), i = i.times(l), s = o.plus(i.div(n += 2)), s.d[t] !== undefined)
        for (e = t;s.d[e] === o.d[e] && e--; )
          ;
    return r && (s = s.times(2 << r - 1)), x = true, y(s, c.precision = p, c.rounding = d, true);
  };
  m.isFinite = function() {
    return !!this.d;
  };
  m.isInteger = m.isInt = function() {
    return !!this.d && ee(this.e / b) > this.d.length - 2;
  };
  m.isNaN = function() {
    return !this.s;
  };
  m.isNegative = m.isNeg = function() {
    return this.s < 0;
  };
  m.isPositive = m.isPos = function() {
    return this.s > 0;
  };
  m.isZero = function() {
    return !!this.d && this.d[0] === 0;
  };
  m.lessThan = m.lt = function(e) {
    return this.cmp(e) < 0;
  };
  m.lessThanOrEqualTo = m.lte = function(e) {
    return this.cmp(e) < 1;
  };
  m.logarithm = m.log = function(e) {
    var t, r, n, i, o, s, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding, f = 5;
    if (e == null)
      e = new c(10), t = true;
    else {
      if (e = new c(e), r = e.d, e.s < 0 || !r || !r[0] || e.eq(1))
        return new c(NaN);
      t = e.eq(10);
    }
    if (r = u.d, u.s < 0 || !r || !r[0] || u.eq(1))
      return new c(r && !r[0] ? -1 / 0 : u.s != 1 ? NaN : r ? 0 : 1 / 0);
    if (t)
      if (r.length > 1)
        o = true;
      else {
        for (i = r[0];i % 10 === 0; )
          i /= 10;
        o = i !== 1;
      }
    if (x = false, a = p + f, s = He(u, a), n = t ? nn(c, a + 10) : He(e, a), l = N(s, n, a, 1), rr(l.d, i = p, d))
      do
        if (a += 10, s = He(u, a), n = t ? nn(c, a + 10) : He(e, a), l = N(s, n, a, 1), !o) {
          +K(l.d).slice(i + 1, i + 15) + 1 == 100000000000000 && (l = y(l, p + 1, 0));
          break;
        }
      while (rr(l.d, i += 10, d));
    return x = true, y(l, p, d);
  };
  m.minus = m.sub = function(e) {
    var t, r, n, i, o, s, a, l, u, c, p, d, f = this, g = f.constructor;
    if (e = new g(e), !f.d || !e.d)
      return !f.s || !e.s ? e = new g(NaN) : f.d ? e.s = -e.s : e = new g(e.d || f.s !== e.s ? f : NaN), e;
    if (f.s != e.s)
      return e.s = -e.s, f.plus(e);
    if (u = f.d, d = e.d, a = g.precision, l = g.rounding, !u[0] || !d[0]) {
      if (d[0])
        e.s = -e.s;
      else if (u[0])
        e = new g(f);
      else
        return new g(l === 3 ? -0 : 0);
      return x ? y(e, a, l) : e;
    }
    if (r = ee(e.e / b), c = ee(f.e / b), u = u.slice(), o = c - r, o) {
      for (p = o < 0, p ? (t = u, o = -o, s = d.length) : (t = d, r = c, s = u.length), n = Math.max(Math.ceil(a / b), s) + 2, o > n && (o = n, t.length = 1), t.reverse(), n = o;n--; )
        t.push(0);
      t.reverse();
    } else {
      for (n = u.length, s = d.length, p = n < s, p && (s = n), n = 0;n < s; n++)
        if (u[n] != d[n]) {
          p = u[n] < d[n];
          break;
        }
      o = 0;
    }
    for (p && (t = u, u = d, d = t, e.s = -e.s), s = u.length, n = d.length - s;n > 0; --n)
      u[s++] = 0;
    for (n = d.length;n > o; ) {
      if (u[--n] < d[n]) {
        for (i = n;i && u[--i] === 0; )
          u[i] = ge - 1;
        --u[i], u[n] += ge;
      }
      u[n] -= d[n];
    }
    for (;u[--s] === 0; )
      u.pop();
    for (;u[0] === 0; u.shift())
      --r;
    return u[0] ? (e.d = u, e.e = sn(u, r), x ? y(e, a, l) : e) : new g(l === 3 ? -0 : 0);
  };
  m.modulo = m.mod = function(e) {
    var t, r = this, n = r.constructor;
    return e = new n(e), !r.d || !e.s || e.d && !e.d[0] ? new n(NaN) : !e.d || r.d && !r.d[0] ? y(new n(r), n.precision, n.rounding) : (x = false, n.modulo == 9 ? (t = N(r, e.abs(), 0, 3, 1), t.s *= e.s) : t = N(r, e, 0, n.modulo, 1), t = t.times(e), x = true, r.minus(t));
  };
  m.naturalExponential = m.exp = function() {
    return Ri(this);
  };
  m.naturalLogarithm = m.ln = function() {
    return He(this);
  };
  m.negated = m.neg = function() {
    var e = new this.constructor(this);
    return e.s = -e.s, y(e);
  };
  m.plus = m.add = function(e) {
    var t, r, n, i, o, s, a, l, u, c, p = this, d = p.constructor;
    if (e = new d(e), !p.d || !e.d)
      return !p.s || !e.s ? e = new d(NaN) : p.d || (e = new d(e.d || p.s === e.s ? p : NaN)), e;
    if (p.s != e.s)
      return e.s = -e.s, p.minus(e);
    if (u = p.d, c = e.d, a = d.precision, l = d.rounding, !u[0] || !c[0])
      return c[0] || (e = new d(p)), x ? y(e, a, l) : e;
    if (o = ee(p.e / b), n = ee(e.e / b), u = u.slice(), i = o - n, i) {
      for (i < 0 ? (r = u, i = -i, s = c.length) : (r = c, n = o, s = u.length), o = Math.ceil(a / b), s = o > s ? o + 1 : s + 1, i > s && (i = s, r.length = 1), r.reverse();i--; )
        r.push(0);
      r.reverse();
    }
    for (s = u.length, i = c.length, s - i < 0 && (i = s, r = c, c = u, u = r), t = 0;i; )
      t = (u[--i] = u[i] + c[i] + t) / ge | 0, u[i] %= ge;
    for (t && (u.unshift(t), ++n), s = u.length;u[--s] == 0; )
      u.pop();
    return e.d = u, e.e = sn(u, n), x ? y(e, a, l) : e;
  };
  m.precision = m.sd = function(e) {
    var t, r = this;
    if (e !== undefined && e !== !!e && e !== 1 && e !== 0)
      throw Error(Ke + e);
    return r.d ? (t = Cs(r.d), e && r.e + 1 > t && (t = r.e + 1)) : t = NaN, t;
  };
  m.round = function() {
    var e = this, t = e.constructor;
    return y(new t(e), e.e + 1, t.rounding);
  };
  m.sine = m.sin = function() {
    var e, t, r = this, n = r.constructor;
    return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + Math.max(r.e, r.sd()) + b, n.rounding = 1, r = Rc(n, Os(n, r)), n.precision = e, n.rounding = t, y(Ne > 2 ? r.neg() : r, e, t, true)) : new n(NaN);
  };
  m.squareRoot = m.sqrt = function() {
    var e, t, r, n, i, o, s = this, a = s.d, l = s.e, u = s.s, c = s.constructor;
    if (u !== 1 || !a || !a[0])
      return new c(!u || u < 0 && (!a || a[0]) ? NaN : a ? s : 1 / 0);
    for (x = false, u = Math.sqrt(+s), u == 0 || u == 1 / 0 ? (t = K(a), (t.length + l) % 2 == 0 && (t += "0"), u = Math.sqrt(t), l = ee((l + 1) / 2) - (l < 0 || l % 2), u == 1 / 0 ? t = "5e" + l : (t = u.toExponential(), t = t.slice(0, t.indexOf("e") + 1) + l), n = new c(t)) : n = new c(u.toString()), r = (l = c.precision) + 3;; )
      if (o = n, n = o.plus(N(s, o, r + 2, 1)).times(0.5), K(o.d).slice(0, r) === (t = K(n.d)).slice(0, r))
        if (t = t.slice(r - 3, r + 1), t == "9999" || !i && t == "4999") {
          if (!i && (y(o, l + 1, 0), o.times(o).eq(s))) {
            n = o;
            break;
          }
          r += 4, i = 1;
        } else {
          (!+t || !+t.slice(1) && t.charAt(0) == "5") && (y(n, l + 1, 1), e = !n.times(n).eq(s));
          break;
        }
    return x = true, y(n, l, c.rounding, e);
  };
  m.tangent = m.tan = function() {
    var e, t, r = this, n = r.constructor;
    return r.isFinite() ? r.isZero() ? new n(r) : (e = n.precision, t = n.rounding, n.precision = e + 10, n.rounding = 1, r = r.sin(), r.s = 1, r = N(r, new n(1).minus(r.times(r)).sqrt(), e + 10, 0), n.precision = e, n.rounding = t, y(Ne == 2 || Ne == 4 ? r.neg() : r, e, t, true)) : new n(NaN);
  };
  m.times = m.mul = function(e) {
    var t, r, n, i, o, s, a, l, u, c = this, p = c.constructor, d = c.d, f = (e = new p(e)).d;
    if (e.s *= c.s, !d || !d[0] || !f || !f[0])
      return new p(!e.s || d && !d[0] && !f || f && !f[0] && !d ? NaN : !d || !f ? e.s / 0 : e.s * 0);
    for (r = ee(c.e / b) + ee(e.e / b), l = d.length, u = f.length, l < u && (o = d, d = f, f = o, s = l, l = u, u = s), o = [], s = l + u, n = s;n--; )
      o.push(0);
    for (n = u;--n >= 0; ) {
      for (t = 0, i = l + n;i > n; )
        a = o[i] + f[n] * d[i - n - 1] + t, o[i--] = a % ge | 0, t = a / ge | 0;
      o[i] = (o[i] + t) % ge | 0;
    }
    for (;!o[--s]; )
      o.pop();
    return t ? ++r : o.shift(), e.d = o, e.e = sn(o, r), x ? y(e, p.precision, p.rounding) : e;
  };
  m.toBinary = function(e, t) {
    return Si(this, 2, e, t);
  };
  m.toDecimalPlaces = m.toDP = function(e, t) {
    var r = this, n = r.constructor;
    return r = new n(r), e === undefined ? r : (ie(e, 0, ze), t === undefined ? t = n.rounding : ie(t, 0, 8), y(r, e + r.e + 1, t));
  };
  m.toExponential = function(e, t) {
    var r, n = this, i = n.constructor;
    return e === undefined ? r = we(n, true) : (ie(e, 0, ze), t === undefined ? t = i.rounding : ie(t, 0, 8), n = y(new i(n), e + 1, t), r = we(n, true, e + 1)), n.isNeg() && !n.isZero() ? "-" + r : r;
  };
  m.toFixed = function(e, t) {
    var r, n, i = this, o = i.constructor;
    return e === undefined ? r = we(i) : (ie(e, 0, ze), t === undefined ? t = o.rounding : ie(t, 0, 8), n = y(new o(i), e + i.e + 1, t), r = we(n, false, e + n.e + 1)), i.isNeg() && !i.isZero() ? "-" + r : r;
  };
  m.toFraction = function(e) {
    var t, r, n, i, o, s, a, l, u, c, p, d, f = this, g = f.d, h = f.constructor;
    if (!g)
      return new h(f);
    if (u = r = new h(1), n = l = new h(0), t = new h(n), o = t.e = Cs(g) - f.e - 1, s = o % b, t.d[0] = G(10, s < 0 ? b + s : s), e == null)
      e = o > 0 ? t : u;
    else {
      if (a = new h(e), !a.isInt() || a.lt(u))
        throw Error(Ke + a);
      e = a.gt(t) ? o > 0 ? t : u : a;
    }
    for (x = false, a = new h(K(g)), c = h.precision, h.precision = o = g.length * b * 2;p = N(a, t, 0, 1, 1), i = r.plus(p.times(n)), i.cmp(e) != 1; )
      r = n, n = i, i = u, u = l.plus(p.times(i)), l = i, i = t, t = a.minus(p.times(i)), a = i;
    return i = N(e.minus(r), n, 0, 1, 1), l = l.plus(i.times(u)), r = r.plus(i.times(n)), l.s = u.s = f.s, d = N(u, n, o, 1).minus(f).abs().cmp(N(l, r, o, 1).minus(f).abs()) < 1 ? [u, n] : [l, r], h.precision = c, x = true, d;
  };
  m.toHexadecimal = m.toHex = function(e, t) {
    return Si(this, 16, e, t);
  };
  m.toNearest = function(e, t) {
    var r = this, n = r.constructor;
    if (r = new n(r), e == null) {
      if (!r.d)
        return r;
      e = new n(1), t = n.rounding;
    } else {
      if (e = new n(e), t === undefined ? t = n.rounding : ie(t, 0, 8), !r.d)
        return e.s ? r : e;
      if (!e.d)
        return e.s && (e.s = r.s), e;
    }
    return e.d[0] ? (x = false, r = N(r, e, 0, t, 1).times(e), x = true, y(r)) : (e.s = r.s, r = e), r;
  };
  m.toNumber = function() {
    return +this;
  };
  m.toOctal = function(e, t) {
    return Si(this, 8, e, t);
  };
  m.toPower = m.pow = function(e) {
    var t, r, n, i, o, s, a = this, l = a.constructor, u = +(e = new l(e));
    if (!a.d || !e.d || !a.d[0] || !e.d[0])
      return new l(G(+a, u));
    if (a = new l(a), a.eq(1))
      return a;
    if (n = l.precision, o = l.rounding, e.eq(1))
      return y(a, n, o);
    if (t = ee(e.e / b), t >= e.d.length - 1 && (r = u < 0 ? -u : u) <= xc)
      return i = Ss(l, a, r, n), e.s < 0 ? new l(1).div(i) : y(i, n, o);
    if (s = a.s, s < 0) {
      if (t < e.d.length - 1)
        return new l(NaN);
      if (e.d[t] & 1 || (s = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1)
        return a.s = s, a;
    }
    return r = G(+a, u), t = r == 0 || !isFinite(r) ? ee(u * (Math.log("0." + K(a.d)) / Math.LN10 + a.e + 1)) : new l(r + "").e, t > l.maxE + 1 || t < l.minE - 1 ? new l(t > 0 ? s / 0 : 0) : (x = false, l.rounding = a.s = 1, r = Math.min(12, (t + "").length), i = Ri(e.times(He(a, n + r)), n), i.d && (i = y(i, n + 5, 1), rr(i.d, n, o) && (t = n + 10, i = y(Ri(e.times(He(a, t + r)), t), t + 5, 1), +K(i.d).slice(n + 1, n + 15) + 1 == 100000000000000 && (i = y(i, n + 1, 0)))), i.s = s, x = true, l.rounding = o, y(i, n, o));
  };
  m.toPrecision = function(e, t) {
    var r, n = this, i = n.constructor;
    return e === undefined ? r = we(n, n.e <= i.toExpNeg || n.e >= i.toExpPos) : (ie(e, 1, ze), t === undefined ? t = i.rounding : ie(t, 0, 8), n = y(new i(n), e, t), r = we(n, e <= n.e || n.e <= i.toExpNeg, e)), n.isNeg() && !n.isZero() ? "-" + r : r;
  };
  m.toSignificantDigits = m.toSD = function(e, t) {
    var r = this, n = r.constructor;
    return e === undefined ? (e = n.precision, t = n.rounding) : (ie(e, 1, ze), t === undefined ? t = n.rounding : ie(t, 0, 8)), y(new n(r), e, t);
  };
  m.toString = function() {
    var e = this, t = e.constructor, r = we(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
    return e.isNeg() && !e.isZero() ? "-" + r : r;
  };
  m.truncated = m.trunc = function() {
    return y(new this.constructor(this), this.e + 1, 1);
  };
  m.valueOf = m.toJSON = function() {
    var e = this, t = e.constructor, r = we(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
    return e.isNeg() ? "-" + r : r;
  };
  var N = function() {
    function e(n, i, o) {
      var s, a = 0, l = n.length;
      for (n = n.slice();l--; )
        s = n[l] * i + a, n[l] = s % o | 0, a = s / o | 0;
      return a && n.unshift(a), n;
    }
    function t(n, i, o, s) {
      var a, l;
      if (o != s)
        l = o > s ? 1 : -1;
      else
        for (a = l = 0;a < o; a++)
          if (n[a] != i[a]) {
            l = n[a] > i[a] ? 1 : -1;
            break;
          }
      return l;
    }
    function r(n, i, o, s) {
      for (var a = 0;o--; )
        n[o] -= a, a = n[o] < i[o] ? 1 : 0, n[o] = a * s + n[o] - i[o];
      for (;!n[0] && n.length > 1; )
        n.shift();
    }
    return function(n, i, o, s, a, l) {
      var u, c, p, d, f, g, h, O, T, S, C, E, me, ae, Bt, U, ne, Ie, z, dt, Lr = n.constructor, qn = n.s == i.s ? 1 : -1, Y = n.d, _ = i.d;
      if (!Y || !Y[0] || !_ || !_[0])
        return new Lr(!n.s || !i.s || (Y ? _ && Y[0] == _[0] : !_) ? NaN : Y && Y[0] == 0 || !_ ? qn * 0 : qn / 0);
      for (l ? (f = 1, c = n.e - i.e) : (l = ge, f = b, c = ee(n.e / f) - ee(i.e / f)), z = _.length, ne = Y.length, T = new Lr(qn), S = T.d = [], p = 0;_[p] == (Y[p] || 0); p++)
        ;
      if (_[p] > (Y[p] || 0) && c--, o == null ? (ae = o = Lr.precision, s = Lr.rounding) : a ? ae = o + (n.e - i.e) + 1 : ae = o, ae < 0)
        S.push(1), g = true;
      else {
        if (ae = ae / f + 2 | 0, p = 0, z == 1) {
          for (d = 0, _ = _[0], ae++;(p < ne || d) && ae--; p++)
            Bt = d * l + (Y[p] || 0), S[p] = Bt / _ | 0, d = Bt % _ | 0;
          g = d || p < ne;
        } else {
          for (d = l / (_[0] + 1) | 0, d > 1 && (_ = e(_, d, l), Y = e(Y, d, l), z = _.length, ne = Y.length), U = z, C = Y.slice(0, z), E = C.length;E < z; )
            C[E++] = 0;
          dt = _.slice(), dt.unshift(0), Ie = _[0], _[1] >= l / 2 && ++Ie;
          do
            d = 0, u = t(_, C, z, E), u < 0 ? (me = C[0], z != E && (me = me * l + (C[1] || 0)), d = me / Ie | 0, d > 1 ? (d >= l && (d = l - 1), h = e(_, d, l), O = h.length, E = C.length, u = t(h, C, O, E), u == 1 && (d--, r(h, z < O ? dt : _, O, l))) : (d == 0 && (u = d = 1), h = _.slice()), O = h.length, O < E && h.unshift(0), r(C, h, E, l), u == -1 && (E = C.length, u = t(_, C, z, E), u < 1 && (d++, r(C, z < E ? dt : _, E, l))), E = C.length) : u === 0 && (d++, C = [0]), S[p++] = d, u && C[0] ? C[E++] = Y[U] || 0 : (C = [Y[U]], E = 1);
          while ((U++ < ne || C[0] !== undefined) && ae--);
          g = C[0] !== undefined;
        }
        S[0] || S.shift();
      }
      if (f == 1)
        T.e = c, xs = g;
      else {
        for (p = 1, d = S[0];d >= 10; d /= 10)
          p++;
        T.e = p + c * f - 1, y(T, a ? o + T.e + 1 : o, s, g);
      }
      return T;
    };
  }();
  m[Symbol.for("nodejs.util.inspect.custom")] = m.toString;
  m[Symbol.toStringTag] = "Decimal";
  var it = m.constructor = ks(vi);
  tn = new it(tn);
  rn = new it(rn);
  var xe = it;
  var Ms = k(fi());
  var Ns = k(import.meta.require("fs"));
  var Ds = { keyword: De, entity: De, value: (e) => H(rt(e)), punctuation: rt, directive: De, function: De, variable: (e) => H(rt(e)), string: (e) => H(qe(e)), boolean: ke, number: De, comment: Gt };
  var mp = (e) => e;
  var un = {};
  var fp = 0;
  var P = { manual: un.Prism && un.Prism.manual, disableWorkerMessageHandler: un.Prism && un.Prism.disableWorkerMessageHandler, util: { encode: function(e) {
    if (e instanceof he) {
      let t = e;
      return new he(t.type, P.util.encode(t.content), t.alias);
    } else
      return Array.isArray(e) ? e.map(P.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
  }, type: function(e) {
    return Object.prototype.toString.call(e).slice(8, -1);
  }, objId: function(e) {
    return e.__id || Object.defineProperty(e, "__id", { value: ++fp }), e.__id;
  }, clone: function e(t, r) {
    let n, i, o = P.util.type(t);
    switch (r = r || {}, o) {
      case "Object":
        if (i = P.util.objId(t), r[i])
          return r[i];
        n = {}, r[i] = n;
        for (let s in t)
          t.hasOwnProperty(s) && (n[s] = e(t[s], r));
        return n;
      case "Array":
        return i = P.util.objId(t), r[i] ? r[i] : (n = [], r[i] = n, t.forEach(function(s, a) {
          n[a] = e(s, r);
        }), n);
      default:
        return t;
    }
  } }, languages: { extend: function(e, t) {
    let r = P.util.clone(P.languages[e]);
    for (let n in t)
      r[n] = t[n];
    return r;
  }, insertBefore: function(e, t, r, n) {
    n = n || P.languages;
    let i = n[e], o = {};
    for (let a in i)
      if (i.hasOwnProperty(a)) {
        if (a == t)
          for (let l in r)
            r.hasOwnProperty(l) && (o[l] = r[l]);
        r.hasOwnProperty(a) || (o[a] = i[a]);
      }
    let s = n[e];
    return n[e] = o, P.languages.DFS(P.languages, function(a, l) {
      l === s && a != e && (this[a] = o);
    }), o;
  }, DFS: function e(t, r, n, i) {
    i = i || {};
    let o = P.util.objId;
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        r.call(t, s, t[s], n || s);
        let a = t[s], l = P.util.type(a);
        l === "Object" && !i[o(a)] ? (i[o(a)] = true, e(a, r, null, i)) : l === "Array" && !i[o(a)] && (i[o(a)] = true, e(a, r, s, i));
      }
  } }, plugins: {}, highlight: function(e, t, r) {
    let n = { code: e, grammar: t, language: r };
    return P.hooks.run("before-tokenize", n), n.tokens = P.tokenize(n.code, n.grammar), P.hooks.run("after-tokenize", n), he.stringify(P.util.encode(n.tokens), n.language);
  }, matchGrammar: function(e, t, r, n, i, o, s) {
    for (let h in r) {
      if (!r.hasOwnProperty(h) || !r[h])
        continue;
      if (h == s)
        return;
      let O = r[h];
      O = P.util.type(O) === "Array" ? O : [O];
      for (let T = 0;T < O.length; ++T) {
        let S = O[T], C = S.inside, E = !!S.lookbehind, me = !!S.greedy, ae = 0, Bt = S.alias;
        if (me && !S.pattern.global) {
          let U = S.pattern.toString().match(/[imuy]*$/)[0];
          S.pattern = RegExp(S.pattern.source, U + "g");
        }
        S = S.pattern || S;
        for (let U = n, ne = i;U < t.length; ne += t[U].length, ++U) {
          let Ie = t[U];
          if (t.length > e.length)
            return;
          if (Ie instanceof he)
            continue;
          if (me && U != t.length - 1) {
            S.lastIndex = ne;
            var p = S.exec(e);
            if (!p)
              break;
            var c = p.index + (E ? p[1].length : 0), d = p.index + p[0].length, a = U, l = ne;
            for (let _ = t.length;a < _ && (l < d || !t[a].type && !t[a - 1].greedy); ++a)
              l += t[a].length, c >= l && (++U, ne = l);
            if (t[U] instanceof he)
              continue;
            u = a - U, Ie = e.slice(ne, l), p.index -= ne;
          } else {
            S.lastIndex = 0;
            var p = S.exec(Ie), u = 1;
          }
          if (!p) {
            if (o)
              break;
            continue;
          }
          E && (ae = p[1] ? p[1].length : 0);
          var c = p.index + ae, p = p[0].slice(ae), d = c + p.length, f = Ie.slice(0, c), g = Ie.slice(d);
          let z = [U, u];
          f && (++U, ne += f.length, z.push(f));
          let dt = new he(h, C ? P.tokenize(p, C) : p, Bt, p, me);
          if (z.push(dt), g && z.push(g), Array.prototype.splice.apply(t, z), u != 1 && P.matchGrammar(e, t, r, U, ne, true, h), o)
            break;
        }
      }
    }
  }, tokenize: function(e, t) {
    let r = [e], n = t.rest;
    if (n) {
      for (let i in n)
        t[i] = n[i];
      delete t.rest;
    }
    return P.matchGrammar(e, r, t, 0, 0, false), r;
  }, hooks: { all: {}, add: function(e, t) {
    let r = P.hooks.all;
    r[e] = r[e] || [], r[e].push(t);
  }, run: function(e, t) {
    let r = P.hooks.all[e];
    if (!(!r || !r.length))
      for (var n = 0, i;i = r[n++]; )
        i(t);
  } }, Token: he };
  P.languages.clike = { comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }], string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true }, "class-name": { pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i, lookbehind: true, inside: { punctuation: /[.\\]/ } }, keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/, boolean: /\b(?:true|false)\b/, function: /\w+(?=\()/, number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i, operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/, punctuation: /[{}[\];(),.:]/ };
  P.languages.javascript = P.languages.extend("clike", { "class-name": [P.languages.clike["class-name"], { pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/, lookbehind: true }], keyword: [{ pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: true }, { pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/, lookbehind: true }], number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/, function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/, operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/ });
  P.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
  P.languages.insertBefore("javascript", "keyword", { regex: { pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/, lookbehind: true, greedy: true }, "function-variable": { pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/, alias: "function" }, parameter: [{ pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/, lookbehind: true, inside: P.languages.javascript }, { pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i, inside: P.languages.javascript }, { pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/, lookbehind: true, inside: P.languages.javascript }, { pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/, lookbehind: true, inside: P.languages.javascript }], constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/ });
  P.languages.markup && P.languages.markup.tag.addInlined("script", "javascript");
  P.languages.js = P.languages.javascript;
  P.languages.typescript = P.languages.extend("javascript", { keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/, builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/ });
  P.languages.ts = P.languages.typescript;
  he.stringify = function(e, t) {
    return typeof e == "string" ? e : Array.isArray(e) ? e.map(function(r) {
      return he.stringify(r, t);
    }).join("") : gp(e.type)(e.content);
  };
  var Fs = k(us());
  var cn = class e {
    static read(t) {
      let r;
      try {
        r = Ns.default.readFileSync(t, "utf-8");
      } catch {
        return null;
      }
      return e.fromContent(r);
    }
    static fromContent(t) {
      let r = t.split(/\r?\n/);
      return new e(1, r);
    }
    constructor(t, r) {
      this.firstLineNumber = t, this.lines = r;
    }
    get lastLineNumber() {
      return this.firstLineNumber + this.lines.length - 1;
    }
    mapLineAt(t, r) {
      if (t < this.firstLineNumber || t > this.lines.length + this.firstLineNumber)
        return this;
      let n = t - this.firstLineNumber, i = [...this.lines];
      return i[n] = r(i[n]), new e(this.firstLineNumber, i);
    }
    mapLines(t) {
      return new e(this.firstLineNumber, this.lines.map((r, n) => t(r, this.firstLineNumber + n)));
    }
    lineAt(t) {
      return this.lines[t - this.firstLineNumber];
    }
    prependSymbolAt(t, r) {
      return this.mapLines((n, i) => i === t ? `${r} ${n}` : `  ${n}`);
    }
    slice(t, r) {
      let n = this.lines.slice(t - 1, r).join(`
`);
      return new e(t, Ls(n).split(`
`));
    }
    highlight() {
      let t = _s(this.toString());
      return new e(this.firstLineNumber, t.split(`
`));
    }
    toString() {
      return this.lines.join(`
`);
    }
  };
  var yp = { red: ce, gray: Gt, dim: Oe, bold: H, underline: X, highlightSource: (e) => e.highlight() };
  var bp = { red: (e) => e, gray: (e) => e, dim: (e) => e, bold: (e) => e, underline: (e) => e, highlightSource: (e) => e };
  var Gs = k(Ai());
  var ue = class {
    constructor(t, r) {
      this.name = t;
      this.value = r;
      this.isRequired = false;
    }
    makeRequired() {
      return this.isRequired = true, this;
    }
    write(t) {
      let { colors: { green: r } } = t.context;
      t.addMarginSymbol(r(this.isRequired ? "+" : "?")), t.write(r(this.name)), this.isRequired || t.write(r("?")), t.write(r(": ")), typeof this.value == "string" ? t.write(r(this.value)) : t.write(this.value);
    }
  };
  var Rt = class {
    constructor(t = 0, r) {
      this.context = r;
      this.lines = [];
      this.currentLine = "";
      this.currentIndent = 0;
      this.currentIndent = t;
    }
    write(t) {
      return typeof t == "string" ? this.currentLine += t : t.write(this), this;
    }
    writeJoined(t, r, n = (i, o) => o.write(i)) {
      let i = r.length - 1;
      for (let o = 0;o < r.length; o++)
        n(r[o], this), o !== i && this.write(t);
      return this;
    }
    writeLine(t) {
      return this.write(t).newLine();
    }
    newLine() {
      this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = undefined;
      let t = this.afterNextNewLineCallback;
      return this.afterNextNewLineCallback = undefined, t?.(), this;
    }
    withIndent(t) {
      return this.indent(), t(this), this.unindent(), this;
    }
    afterNextNewline(t) {
      return this.afterNextNewLineCallback = t, this;
    }
    indent() {
      return this.currentIndent++, this;
    }
    unindent() {
      return this.currentIndent > 0 && this.currentIndent--, this;
    }
    addMarginSymbol(t) {
      return this.marginSymbol = t, this;
    }
    toString() {
      return this.lines.concat(this.indentedCurrentLine()).join(`
`);
    }
    getCurrentLineLength() {
      return this.currentLine.length;
    }
    indentedCurrentLine() {
      let t = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
      return this.marginSymbol ? this.marginSymbol + t.slice(1) : t;
    }
  };
  var dn = class {
    constructor(t) {
      this.value = t;
    }
    write(t) {
      t.write(this.value);
    }
    markAsError() {
      this.value.markAsError();
    }
  };
  var mn = (e) => e;
  var fn = { bold: mn, red: mn, green: mn, dim: mn, enabled: false };
  var Us = { bold: H, red: ce, green: qe, dim: Oe, enabled: true };
  var Ct = { write(e) {
    e.writeLine(",");
  } };
  var Pe = class {
    constructor(t) {
      this.contents = t;
      this.isUnderlined = false;
      this.color = (t2) => t2;
    }
    underline() {
      return this.isUnderlined = true, this;
    }
    setColor(t) {
      return this.color = t, this;
    }
    write(t) {
      let r = t.getCurrentLineLength();
      t.write(this.color(this.contents)), this.isUnderlined && t.afterNextNewline(() => {
        t.write(" ".repeat(r)).writeLine(this.color("~".repeat(this.contents.length)));
      });
    }
  };
  var Ye = class {
    constructor() {
      this.hasError = false;
    }
    markAsError() {
      return this.hasError = true, this;
    }
  };
  var St = class extends Ye {
    constructor() {
      super(...arguments);
      this.items = [];
    }
    addItem(r) {
      return this.items.push(new dn(r)), this;
    }
    getField(r) {
      return this.items[r];
    }
    getPrintWidth() {
      return this.items.length === 0 ? 2 : Math.max(...this.items.map((n) => n.value.getPrintWidth())) + 2;
    }
    write(r) {
      if (this.items.length === 0) {
        this.writeEmpty(r);
        return;
      }
      this.writeWithItems(r);
    }
    writeEmpty(r) {
      let n = new Pe("[]");
      this.hasError && n.setColor(r.context.colors.red).underline(), r.write(n);
    }
    writeWithItems(r) {
      let { colors: n } = r.context;
      r.writeLine("[").withIndent(() => r.writeJoined(Ct, this.items).newLine()).write("]"), this.hasError && r.afterNextNewline(() => {
        r.writeLine(n.red("~".repeat(this.getPrintWidth())));
      });
    }
    asObject() {
    }
  };
  var At = class e extends Ye {
    constructor() {
      super(...arguments);
      this.fields = {};
      this.suggestions = [];
    }
    addField(r) {
      this.fields[r.name] = r;
    }
    addSuggestion(r) {
      this.suggestions.push(r);
    }
    getField(r) {
      return this.fields[r];
    }
    getDeepField(r) {
      let [n, ...i] = r, o = this.getField(n);
      if (!o)
        return;
      let s = o;
      for (let a of i) {
        let l;
        if (s.value instanceof e ? l = s.value.getField(a) : s.value instanceof St && (l = s.value.getField(Number(a))), !l)
          return;
        s = l;
      }
      return s;
    }
    getDeepFieldValue(r) {
      return r.length === 0 ? this : this.getDeepField(r)?.value;
    }
    hasField(r) {
      return !!this.getField(r);
    }
    removeAllFields() {
      this.fields = {};
    }
    removeField(r) {
      delete this.fields[r];
    }
    getFields() {
      return this.fields;
    }
    isEmpty() {
      return Object.keys(this.fields).length === 0;
    }
    getFieldValue(r) {
      return this.getField(r)?.value;
    }
    getDeepSubSelectionValue(r) {
      let n = this;
      for (let i of r) {
        if (!(n instanceof e))
          return;
        let o = n.getSubSelectionValue(i);
        if (!o)
          return;
        n = o;
      }
      return n;
    }
    getDeepSelectionParent(r) {
      let n = this.getSelectionParent();
      if (!n)
        return;
      let i = n;
      for (let o of r) {
        let s = i.value.getFieldValue(o);
        if (!s || !(s instanceof e))
          return;
        let a = s.getSelectionParent();
        if (!a)
          return;
        i = a;
      }
      return i;
    }
    getSelectionParent() {
      let r = this.getField("select")?.value.asObject();
      if (r)
        return { kind: "select", value: r };
      let n = this.getField("include")?.value.asObject();
      if (n)
        return { kind: "include", value: n };
    }
    getSubSelectionValue(r) {
      return this.getSelectionParent()?.value.fields[r].value;
    }
    getPrintWidth() {
      let r = Object.values(this.fields);
      return r.length == 0 ? 2 : Math.max(...r.map((i) => i.getPrintWidth())) + 2;
    }
    write(r) {
      let n = Object.values(this.fields);
      if (n.length === 0 && this.suggestions.length === 0) {
        this.writeEmpty(r);
        return;
      }
      this.writeWithContents(r, n);
    }
    asObject() {
      return this;
    }
    writeEmpty(r) {
      let n = new Pe("{}");
      this.hasError && n.setColor(r.context.colors.red).underline(), r.write(n);
    }
    writeWithContents(r, n) {
      r.writeLine("{").withIndent(() => {
        r.writeJoined(Ct, [...n, ...this.suggestions]).newLine();
      }), r.write("}"), this.hasError && r.afterNextNewline(() => {
        r.writeLine(r.context.colors.red("~".repeat(this.getPrintWidth())));
      });
    }
  };
  var W = class extends Ye {
    constructor(r) {
      super();
      this.text = r;
    }
    getPrintWidth() {
      return this.text.length;
    }
    write(r) {
      let n = new Pe(this.text);
      this.hasError && n.underline().setColor(r.context.colors.red), r.write(n);
    }
    asObject() {
    }
  };
  var nr = class {
    constructor() {
      this.fields = [];
    }
    addField(t, r) {
      return this.fields.push({ write(n) {
        let { green: i, dim: o } = n.context.colors;
        n.write(i(o(`${t}: ${r}`))).addMarginSymbol(i(o("+")));
      } }), this;
    }
    write(t) {
      let { colors: { green: r } } = t.context;
      t.writeLine(r("{")).withIndent(() => {
        t.writeJoined(Ct, this.fields).newLine();
      }).write(r("}")).addMarginSymbol(r("+"));
    }
  };
  var Hp = 3;
  var sr = class {
    constructor(t, r, n, i, o) {
      this.modelName = t, this.name = r, this.typeName = n, this.isList = i, this.isEnum = o;
    }
    _toGraphQLInputType() {
      let t = this.isList ? "List" : "", r = this.isEnum ? "Enum" : "";
      return `${t}${r}${this.typeName}FieldRefInput<${this.modelName}>`;
    }
  };
  var hn = Symbol();
  var Ii = new WeakMap;
  var Me = class {
    constructor(t) {
      t === hn ? Ii.set(this, `Prisma.${this._getName()}`) : Ii.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
    }
    _getName() {
      return this.constructor.name;
    }
    toString() {
      return Ii.get(this);
    }
  };
  var ar = class extends Me {
    _getNamespace() {
      return "NullTypes";
    }
  };
  var lr = class extends ar {
  };
  Oi(lr, "DbNull");
  var ur = class extends ar {
  };
  Oi(ur, "JsonNull");
  var cr = class extends ar {
  };
  Oi(cr, "AnyNull");
  var yn = { classes: { DbNull: lr, JsonNull: ur, AnyNull: cr }, instances: { DbNull: new lr(hn), JsonNull: new ur(hn), AnyNull: new cr(hn) } };
  var Ys = ": ";
  var bn = class {
    constructor(t, r) {
      this.name = t;
      this.value = r;
      this.hasError = false;
    }
    markAsError() {
      this.hasError = true;
    }
    getPrintWidth() {
      return this.name.length + this.value.getPrintWidth() + Ys.length;
    }
    write(t) {
      let r = new Pe(this.name);
      this.hasError && r.underline().setColor(t.context.colors.red), t.write(r).write(Ys).write(this.value);
    }
  };
  var ki = class {
    constructor(t) {
      this.errorMessages = [];
      this.arguments = t;
    }
    write(t) {
      t.write(this.arguments);
    }
    addErrorMessage(t) {
      this.errorMessages.push(t);
    }
    renderAllMessages(t) {
      return this.errorMessages.map((r) => r(t)).join(`
`);
    }
  };
  var ve = class {
    constructor() {
      this._map = new Map;
    }
    get(t) {
      return this._map.get(t)?.value;
    }
    set(t, r) {
      this._map.set(t, { value: r });
    }
    getOrCreate(t, r) {
      let n = this._map.get(t);
      if (n)
        return n.value;
      let i = r();
      return this.set(t, i), i;
    }
  };
  var xn = class {
    constructor(t, r) {
      this.extension = t;
      this.previous = r;
      this.computedFieldsCache = new ve;
      this.modelExtensionsCache = new ve;
      this.queryCallbacksCache = new ve;
      this.clientExtensions = pr(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
      this.batchCallbacks = pr(() => {
        let t2 = this.previous?.getAllBatchQueryCallbacks() ?? [], r2 = this.extension.query?.$__internalBatch;
        return r2 ? t2.concat(r2) : t2;
      });
    }
    getAllComputedFields(t) {
      return this.computedFieldsCache.getOrCreate(t, () => ta(this.previous?.getAllComputedFields(t), this.extension, t));
    }
    getAllClientExtensions() {
      return this.clientExtensions.get();
    }
    getAllModelExtensions(t) {
      return this.modelExtensionsCache.getOrCreate(t, () => {
        let r = Te(t);
        return !this.extension.model || !(this.extension.model[r] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(t) : { ...this.previous?.getAllModelExtensions(t), ...this.extension.model.$allModels, ...this.extension.model[r] };
      });
    }
    getAllQueryCallbacks(t, r) {
      return this.queryCallbacksCache.getOrCreate(`${t}:${r}`, () => {
        let n = this.previous?.getAllQueryCallbacks(t, r) ?? [], i = [], o = this.extension.query;
        return !o || !(o[t] || o.$allModels || o[r] || o.$allOperations) ? n : (o[t] !== undefined && (o[t][r] !== undefined && i.push(o[t][r]), o[t].$allOperations !== undefined && i.push(o[t].$allOperations)), t !== "$none" && o.$allModels !== undefined && (o.$allModels[r] !== undefined && i.push(o.$allModels[r]), o.$allModels.$allOperations !== undefined && i.push(o.$allModels.$allOperations)), o[r] !== undefined && i.push(o[r]), o.$allOperations !== undefined && i.push(o.$allOperations), n.concat(i));
      });
    }
    getAllBatchQueryCallbacks() {
      return this.batchCallbacks.get();
    }
  };
  var kt = class e {
    constructor(t) {
      this.head = t;
    }
    static empty() {
      return new e;
    }
    static single(t) {
      return new e(new xn(t));
    }
    isEmpty() {
      return this.head === undefined;
    }
    append(t) {
      return new e(new xn(t, this.head));
    }
    getAllComputedFields(t) {
      return this.head?.getAllComputedFields(t);
    }
    getAllClientExtensions() {
      return this.head?.getAllClientExtensions();
    }
    getAllModelExtensions(t) {
      return this.head?.getAllModelExtensions(t);
    }
    getAllQueryCallbacks(t, r) {
      return this.head?.getAllQueryCallbacks(t, r) ?? [];
    }
    getAllBatchQueryCallbacks() {
      return this.head?.getAllBatchQueryCallbacks() ?? [];
    }
  };
  var ia = Symbol();
  var dr = class {
    constructor(t) {
      if (t !== ia)
        throw new Error("Skip instance can not be constructed directly");
    }
    ifUndefined(t) {
      return t === undefined ? Pn : t;
    }
  };
  var Pn = new dr(ia);
  var Xp = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
  var oa = "explicitly `undefined` values are not allowed";
  var Di = class e {
    constructor(t) {
      this.params = t;
      this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
    }
    throwValidationError(t) {
      wn({ errors: [t], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
    }
    getSelectionPath() {
      return this.params.selectionPath;
    }
    getArgumentPath() {
      return this.params.argumentPath;
    }
    getArgumentName() {
      return this.params.argumentPath[this.params.argumentPath.length - 1];
    }
    getOutputTypeDescription() {
      if (!(!this.params.modelName || !this.modelOrType))
        return { name: this.params.modelName, fields: this.modelOrType.fields.map((t) => ({ name: t.name, typeName: "boolean", isRelation: t.kind === "object" })) };
    }
    isRawAction() {
      return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
    }
    isPreviewFeatureOn(t) {
      return this.params.previewFeatures.includes(t);
    }
    getComputedFields() {
      if (this.params.modelName)
        return this.params.extensions.getAllComputedFields(this.params.modelName);
    }
    findField(t) {
      return this.modelOrType?.fields.find((r) => r.name === t);
    }
    nestSelection(t) {
      let r = this.findField(t), n = r?.kind === "object" ? r.type : undefined;
      return new e({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(t) });
    }
    getGlobalOmit() {
      return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[xt(this.params.modelName)] ?? {} : {};
    }
    shouldApplyGlobalOmit() {
      switch (this.params.action) {
        case "findFirst":
        case "findFirstOrThrow":
        case "findUniqueOrThrow":
        case "findMany":
        case "upsert":
        case "findUnique":
        case "createManyAndReturn":
        case "create":
        case "update":
        case "delete":
          return true;
        case "executeRaw":
        case "aggregateRaw":
        case "runCommandRaw":
        case "findRaw":
        case "createMany":
        case "deleteMany":
        case "groupBy":
        case "updateMany":
        case "count":
        case "aggregate":
        case "queryRaw":
          return false;
        default:
          Fe(this.params.action, "Unknown action");
      }
    }
    nestArgument(t) {
      return new e({ ...this.params, argumentPath: this.params.argumentPath.concat(t) });
    }
  };
  var Dt = class {
    constructor(t) {
      this._engine = t;
    }
    prometheus(t) {
      return this._engine.metrics({ format: "prometheus", ...t });
    }
    json(t) {
      return this._engine.metrics({ format: "json", ...t });
    }
  };
  var Ni = new WeakMap;
  var Tn = "$$PrismaTypedSql";
  var Mi = class {
    constructor(t, r) {
      Ni.set(this, { sql: t, values: r }), Object.defineProperty(this, Tn, { value: Tn });
    }
    get sql() {
      return Ni.get(this).sql;
    }
    get values() {
      return Ni.get(this).values;
    }
  };
  var $i = class {
    constructor() {
      this.registeredErrors = [];
    }
    consumeError(t) {
      return this.registeredErrors[t];
    }
    registerNewError(t) {
      let r = 0;
      for (;this.registeredErrors[r] !== undefined; )
        r++;
      return this.registeredErrors[r] = { error: t }, r;
    }
  };
  var qi = (e) => {
    let t = new $i, r = Ce(t, e.transactionContext.bind(e)), n = { adapterName: e.adapterName, errorRegistry: t, queryRaw: Ce(t, e.queryRaw.bind(e)), executeRaw: Ce(t, e.executeRaw.bind(e)), provider: e.provider, transactionContext: async (...i) => (await r(...i)).map((s) => ud(t, s)) };
    return e.getConnectionInfo && (n.getConnectionInfo = pd(t, e.getConnectionInfo.bind(e))), n;
  };
  var ud = (e, t) => {
    let r = Ce(e, t.startTransaction.bind(t));
    return { adapterName: t.adapterName, provider: t.provider, queryRaw: Ce(e, t.queryRaw.bind(t)), executeRaw: Ce(e, t.executeRaw.bind(t)), startTransaction: async (...n) => (await r(...n)).map((o) => cd(e, o)) };
  };
  var cd = (e, t) => ({ adapterName: t.adapterName, provider: t.provider, options: t.options, queryRaw: Ce(e, t.queryRaw.bind(t)), executeRaw: Ce(e, t.executeRaw.bind(t)), commit: Ce(e, t.commit.bind(t)), rollback: Ce(e, t.rollback.bind(t)) });
  var Wl = k(oi());
  var Hl = import.meta.require("async_hooks");
  var Kl = import.meta.require("events");
  var zl = k(import.meta.require("fs"));
  var Fr = k(import.meta.require("path"));
  var oe = class e {
    constructor(t, r) {
      if (t.length - 1 !== r.length)
        throw t.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${t.length} strings to have ${t.length - 1} values`);
      let n = r.reduce((s, a) => s + (a instanceof e ? a.values.length : 1), 0);
      this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = t[0];
      let i = 0, o = 0;
      for (;i < r.length; ) {
        let s = r[i++], a = t[i];
        if (s instanceof e) {
          this.strings[o] += s.strings[0];
          let l = 0;
          for (;l < s.values.length; )
            this.values[o++] = s.values[l++], this.strings[o] = s.strings[l];
          this.strings[o] += a;
        } else
          this.values[o++] = s, this.strings[o] = a;
      }
    }
    get sql() {
      let t = this.strings.length, r = 1, n = this.strings[0];
      for (;r < t; )
        n += `?${this.strings[r++]}`;
      return n;
    }
    get statement() {
      let t = this.strings.length, r = 1, n = this.strings[0];
      for (;r < t; )
        n += `:${r}${this.strings[r++]}`;
      return n;
    }
    get text() {
      let t = this.strings.length, r = 1, n = this.strings[0];
      for (;r < t; )
        n += `\$${r}${this.strings[r++]}`;
      return n;
    }
    inspect() {
      return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
    }
  };
  var ma = ji("");
  var Rn = { enumerable: true, configurable: true, writable: true };
  var fa = Symbol.for("nodejs.util.inspect.custom");
  var md = "P2037";
  var hr = "<unknown>";
  var gd = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
  var hd = /\((\S*)(?::(\d+))(?::(\d+))\)/;
  var bd = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
  var wd = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
  var xd = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
  var vd = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
  var Rd = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
  var Bi = class {
    getLocation() {
      return null;
    }
  };
  var Ui = class {
    constructor() {
      this._error = new Error;
    }
    getLocation() {
      let t = this._error.stack;
      if (!t)
        return null;
      let n = ya(t).find((i) => {
        if (!i.file)
          return false;
        let o = mi(i.file);
        return o !== "<anonymous>" && !o.includes("@prisma") && !o.includes("/packages/client/src/runtime/") && !o.endsWith("/runtime/binary.js") && !o.endsWith("/runtime/library.js") && !o.endsWith("/runtime/edge.js") && !o.endsWith("/runtime/edge-esm.js") && !o.startsWith("internal/") && !i.methodName.includes("new ") && !i.methodName.includes("getCallSite") && !i.methodName.includes("Proxy.") && i.methodName.split(".").length < 4;
      });
      return !n || !n.file ? null : { fileName: n.file, lineNumber: n.lineNumber, columnNumber: n.column };
    }
  };
  var ba = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
  var Ta = (e) => Array.isArray(e) ? e : e.split(".");
  var Gi = (e, t) => Ta(t).reduce((r, n) => r && r[n], e);
  var Ra = (e, t, r) => Ta(t).reduceRight((n, i, o, s) => Object.assign({}, Gi(e, s.slice(0, o)), { [i]: n }), r);
  var Md = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
  var $d = ["aggregate", "count", "groupBy"];
  var Wi = Symbol();
  var Fa = (e) => e;
  var ja = L("prisma:client");
  var Va = { Vercel: "vercel", "Netlify CI": "netlify" };
  var Jd = "Cloudflare-Workers";
  var Wd = "node";
  var Hd = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
  var Ka = k(import.meta.require("fs"));
  var Er = k(import.meta.require("path"));
  var zd = L("prisma:client:engines:resolveEnginePath");
  var Yd = () => new RegExp("runtime[\\\\/]library\\.m?js$");
  var Hi = k(bi());
  var el = k(hs());
  var _n = class extends Error {
    constructor(t, r) {
      super(t), this.clientVersion = r.clientVersion, this.cause = r.cause;
    }
    get [Symbol.toStringTag]() {
      return this.name;
    }
  };
  var se = class extends _n {
    constructor(t, r) {
      super(t, r), this.isRetryable = r.isRetryable ?? true;
    }
  };
  var Mt = class extends se {
    constructor(r) {
      super("This request must be retried", A(r, true));
      this.name = "ForcedRetryError";
      this.code = "P5001";
    }
  };
  w(Mt, "ForcedRetryError");
  var at = class extends se {
    constructor(r, n) {
      super(r, A(n, false));
      this.name = "InvalidDatasourceError";
      this.code = "P6001";
    }
  };
  w(at, "InvalidDatasourceError");
  var lt = class extends se {
    constructor(r, n) {
      super(r, A(n, false));
      this.name = "NotImplementedYetError";
      this.code = "P5004";
    }
  };
  w(lt, "NotImplementedYetError");
  var q = class extends se {
    constructor(t, r) {
      super(t, r), this.response = r.response;
      let n = this.response.headers.get("prisma-request-id");
      if (n) {
        let i = `(The request id was: ${n})`;
        this.message = this.message + " " + i;
      }
    }
  };
  var ut = class extends q {
    constructor(r) {
      super("Schema needs to be uploaded", A(r, true));
      this.name = "SchemaMissingError";
      this.code = "P5005";
    }
  };
  w(ut, "SchemaMissingError");
  var Ki = "This request could not be understood by the server";
  var wr = class extends q {
    constructor(r, n, i) {
      super(n || Ki, A(r, false));
      this.name = "BadRequestError";
      this.code = "P5000";
      i && (this.code = i);
    }
  };
  w(wr, "BadRequestError");
  var xr = class extends q {
    constructor(r, n) {
      super("Engine not started: healthcheck timeout", A(r, true));
      this.name = "HealthcheckTimeoutError";
      this.code = "P5013";
      this.logs = n;
    }
  };
  w(xr, "HealthcheckTimeoutError");
  var Pr = class extends q {
    constructor(r, n, i) {
      super(n, A(r, true));
      this.name = "EngineStartupError";
      this.code = "P5014";
      this.logs = i;
    }
  };
  w(Pr, "EngineStartupError");
  var vr = class extends q {
    constructor(r) {
      super("Engine version is not supported", A(r, false));
      this.name = "EngineVersionNotSupportedError";
      this.code = "P5012";
    }
  };
  w(vr, "EngineVersionNotSupportedError");
  var zi = "Request timed out";
  var Tr = class extends q {
    constructor(r, n = zi) {
      super(n, A(r, false));
      this.name = "GatewayTimeoutError";
      this.code = "P5009";
    }
  };
  w(Tr, "GatewayTimeoutError");
  var Xd = "Interactive transaction error";
  var Rr = class extends q {
    constructor(r, n = Xd) {
      super(n, A(r, false));
      this.name = "InteractiveTransactionError";
      this.code = "P5015";
    }
  };
  w(Rr, "InteractiveTransactionError");
  var em = "Request parameters are invalid";
  var Cr = class extends q {
    constructor(r, n = em) {
      super(n, A(r, false));
      this.name = "InvalidRequestError";
      this.code = "P5011";
    }
  };
  w(Cr, "InvalidRequestError");
  var Yi = "Requested resource does not exist";
  var Sr = class extends q {
    constructor(r, n = Yi) {
      super(n, A(r, false));
      this.name = "NotFoundError";
      this.code = "P5003";
    }
  };
  w(Sr, "NotFoundError");
  var Zi = "Unknown server error";
  var $t = class extends q {
    constructor(r, n, i) {
      super(n || Zi, A(r, true));
      this.name = "ServerError";
      this.code = "P5006";
      this.logs = i;
    }
  };
  w($t, "ServerError");
  var Xi = "Unauthorized, check your connection string";
  var Ar = class extends q {
    constructor(r, n = Xi) {
      super(n, A(r, false));
      this.name = "UnauthorizedError";
      this.code = "P5007";
    }
  };
  w(Ar, "UnauthorizedError");
  var eo = "Usage exceeded, retry again later";
  var Ir = class extends q {
    constructor(r, n = eo) {
      super(n, A(r, true));
      this.name = "UsageExceededError";
      this.code = "P5008";
    }
  };
  w(Ir, "UsageExceededError");
  var $e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var al = { "@prisma/debug": "workspace:*", "@prisma/engines-version": "5.22.0-44.605197351a3c8bdd595af2d2a9bc3025bca48ea2", "@prisma/fetch-engine": "workspace:*", "@prisma/get-platform": "workspace:*" };
  var kr = class extends se {
    constructor(r, n) {
      super(`Cannot fetch data from service:
${r}`, A(n, true));
      this.name = "RequestError";
      this.code = "P5010";
    }
  };
  w(kr, "RequestError");
  var am = "function" < "u" ? import.meta.require : () => {
  };
  var ro = class {
    constructor(t = {}) {
      this.headers = new Map;
      for (let [r, n] of Object.entries(t))
        if (typeof n == "string")
          this.headers.set(r, n);
        else if (Array.isArray(n))
          for (let i of n)
            this.headers.set(r, i);
    }
    append(t, r) {
      this.headers.set(t, r);
    }
    delete(t) {
      this.headers.delete(t);
    }
    get(t) {
      return this.headers.get(t) ?? null;
    }
    has(t) {
      return this.headers.has(t);
    }
    set(t, r) {
      this.headers.set(t, r);
    }
    forEach(t, r) {
      for (let [n, i] of this.headers)
        t.call(r, i, n, this);
    }
  };
  var lm = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
  var ll = L("prisma:client:dataproxyEngine");
  var cl = 3;
  var no = L("prisma:client:dataproxyEngine");
  var io = class {
    constructor({ apiKey: t, tracingHelper: r, logLevel: n, logQueries: i, engineHash: o }) {
      this.apiKey = t, this.tracingHelper = r, this.logLevel = n, this.logQueries = i, this.engineHash = o;
    }
    build({ traceparent: t, interactiveTransaction: r } = {}) {
      let n = { Authorization: `Bearer ${this.apiKey}`, "Prisma-Engine-Hash": this.engineHash };
      this.tracingHelper.isEnabled() && (n.traceparent = t ?? this.tracingHelper.getTraceParent()), r && (n["X-transaction-id"] = r.id);
      let i = this.buildCaptureSettings();
      return i.length > 0 && (n["X-capture-telemetry"] = i.join(", ")), n;
    }
    buildCaptureSettings() {
      let t = [];
      return this.tracingHelper.isEnabled() && t.push("tracing"), this.logLevel && t.push(this.logLevel), this.logQueries && t.push("query"), t;
    }
  };
  var Dr = class {
    constructor(t) {
      this.name = "DataProxyEngine";
      ol(t), this.config = t, this.env = { ...t.env, ...typeof process < "u" ? process.env : {} }, this.inlineSchema = il(t.inlineSchema), this.inlineDatasources = t.inlineDatasources, this.inlineSchemaHash = t.inlineSchemaHash, this.clientVersion = t.clientVersion, this.engineHash = t.engineVersion, this.logEmitter = t.logEmitter, this.tracingHelper = t.tracingHelper;
    }
    apiKey() {
      return this.headerBuilder.apiKey;
    }
    version() {
      return this.engineHash;
    }
    async start() {
      this.startPromise !== undefined && await this.startPromise, this.startPromise = (async () => {
        let [t, r] = this.extractHostAndApiKey();
        this.host = t, this.headerBuilder = new io({ apiKey: r, tracingHelper: this.tracingHelper, logLevel: this.config.logLevel, logQueries: this.config.logQueries, engineHash: this.engineHash }), this.remoteClientVersion = await ul(t, this.config), no("host", this.host);
      })(), await this.startPromise;
    }
    async stop() {
    }
    propagateResponseExtensions(t) {
      t?.logs?.length && t.logs.forEach((r) => {
        switch (r.level) {
          case "debug":
          case "error":
          case "trace":
          case "warn":
          case "info":
            break;
          case "query": {
            let n = typeof r.attributes.query == "string" ? r.attributes.query : "";
            if (!this.tracingHelper.isEnabled()) {
              let [i] = n.split("/* traceparent");
              n = i;
            }
            this.logEmitter.emit("query", { query: n, timestamp: sl(r.timestamp), duration: Number(r.attributes.duration_ms), params: r.attributes.params, target: r.attributes.target });
          }
        }
      }), t?.traces?.length && this.tracingHelper.createEngineSpan({ span: true, spans: t.traces });
    }
    onBeforeExit() {
      throw new Error('"beforeExit" hook is not applicable to the remote query engine');
    }
    async url(t) {
      return await this.start(), `https://${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${t}`;
    }
    async uploadSchema() {
      let t = { name: "schemaUpload", internal: true };
      return this.tracingHelper.runInChildSpan(t, async () => {
        let r = await ct(await this.url("schema"), { method: "PUT", headers: this.headerBuilder.build(), body: this.inlineSchema, clientVersion: this.clientVersion });
        r.ok || no("schema response status", r.status);
        let n = await Or(r, this.clientVersion);
        if (n)
          throw this.logEmitter.emit("warn", { message: `Error while uploading schema: ${n.message}`, timestamp: new Date, target: "" }), n;
        this.logEmitter.emit("info", { message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`, timestamp: new Date, target: "" });
      });
    }
    request(t, { traceparent: r, interactiveTransaction: n, customDataProxyFetch: i }) {
      return this.requestInternal({ body: t, traceparent: r, interactiveTransaction: n, customDataProxyFetch: i });
    }
    async requestBatch(t, { traceparent: r, transaction: n, customDataProxyFetch: i }) {
      let o = n?.kind === "itx" ? n.options : undefined, s = Ft(t, n), { batchResult: a, elapsed: l } = await this.requestInternal({ body: s, customDataProxyFetch: i, interactiveTransaction: o, traceparent: r });
      return a.map((u) => ("errors" in u) && u.errors.length > 0 ? st(u.errors[0], this.clientVersion, this.config.activeProvider) : { data: u, elapsed: l });
    }
    requestInternal({ body: t, traceparent: r, customDataProxyFetch: n, interactiveTransaction: i }) {
      return this.withRetry({ actionGerund: "querying", callback: async ({ logHttpCall: o }) => {
        let s = i ? `${i.payload.endpoint}/graphql` : await this.url("graphql");
        o(s);
        let a = await ct(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r, interactiveTransaction: i }), body: JSON.stringify(t), clientVersion: this.clientVersion }, n);
        a.ok || no("graphql response status", a.status), await this.handleError(await Or(a, this.clientVersion));
        let l = await a.json(), u = l.extensions;
        if (u && this.propagateResponseExtensions(u), l.errors)
          throw l.errors.length === 1 ? st(l.errors[0], this.config.clientVersion, this.config.activeProvider) : new B(l.errors, { clientVersion: this.config.clientVersion });
        return l;
      } });
    }
    async transaction(t, r, n) {
      let i = { start: "starting", commit: "committing", rollback: "rolling back" };
      return this.withRetry({ actionGerund: `${i[t]} transaction`, callback: async ({ logHttpCall: o }) => {
        if (t === "start") {
          let s = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }), a = await this.url("transaction/start");
          o(a);
          let l = await ct(a, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), body: s, clientVersion: this.clientVersion });
          await this.handleError(await Or(l, this.clientVersion));
          let u = await l.json(), c = u.extensions;
          c && this.propagateResponseExtensions(c);
          let p = u.id, d = u["data-proxy"].endpoint;
          return { id: p, payload: { endpoint: d } };
        } else {
          let s = `${n.payload.endpoint}/${t}`;
          o(s);
          let a = await ct(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: r.traceparent }), clientVersion: this.clientVersion });
          await this.handleError(await Or(a, this.clientVersion));
          let u = (await a.json()).extensions;
          u && this.propagateResponseExtensions(u);
          return;
        }
      } });
    }
    extractHostAndApiKey() {
      let t = { clientVersion: this.clientVersion }, r = Object.keys(this.inlineDatasources)[0], n = Nt({ inlineDatasources: this.inlineDatasources, overrideDatasources: this.config.overrideDatasources, clientVersion: this.clientVersion, env: this.env }), i;
      try {
        i = new URL(n);
      } catch {
        throw new at(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\``, t);
      }
      let { protocol: o, host: s, searchParams: a } = i;
      if (o !== "prisma:" && o !== "prisma+postgres:")
        throw new at(`Error validating datasource \`${r}\`: the URL must start with the protocol \`prisma://\``, t);
      let l = a.get("api_key");
      if (l === null || l.length < 1)
        throw new at(`Error validating datasource \`${r}\`: the URL must contain a valid API key`, t);
      return [s, l];
    }
    metrics() {
      throw new lt("Metrics are not yet supported for Accelerate", { clientVersion: this.clientVersion });
    }
    async withRetry(t) {
      for (let r = 0;; r++) {
        let n = (i) => {
          this.logEmitter.emit("info", { message: `Calling ${i} (n=${r})`, timestamp: new Date, target: "" });
        };
        try {
          return await t.callback({ logHttpCall: n });
        } catch (i) {
          if (!(i instanceof se) || !i.isRetryable)
            throw i;
          if (r >= cl)
            throw i instanceof Mt ? i.cause : i;
          this.logEmitter.emit("warn", { message: `Attempt ${r + 1}/${cl} failed for ${t.actionGerund}: ${i.message ?? "(unknown)"}`, timestamp: new Date, target: "" });
          let o = await nl(r);
          this.logEmitter.emit("warn", { message: `Retrying after ${o}ms`, timestamp: new Date, target: "" });
        }
      }
    }
    async handleError(t) {
      if (t instanceof ut)
        throw await this.uploadSchema(), new Mt({ clientVersion: this.clientVersion, cause: t });
      if (t)
        throw t;
    }
    applyPendingMigrations() {
      throw new Error("Method not implemented.");
    }
  };
  var so = k(import.meta.require("os"));
  var dl = k(import.meta.require("path"));
  var oo = Symbol("PrismaLibraryEngineCache");
  var ml = { async loadLibrary(e) {
    let t = await Yn(), r = await za("library", e);
    try {
      return e.tracingHelper.runInChildSpan({ name: "loadLibrary", internal: true }, () => dm(r));
    } catch (n) {
      let i = ui({ e: n, platformInfo: t, id: r });
      throw new R(i, e.clientVersion);
    }
  } };
  var ao;
  var fl = { async loadLibrary(e) {
    let { clientVersion: t, adapter: r, engineWasm: n } = e;
    if (r === undefined)
      throw new R(`The \`adapter\` option for \`PrismaClient\` is required in this context (${In().prettyName})`, t);
    if (n === undefined)
      throw new R("WASM engine was unexpectedly `undefined`", t);
    ao === undefined && (ao = (async () => {
      let o = n.getRuntime(), s = await n.getQueryEngineWasmModule();
      if (s == null)
        throw new R("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", t);
      let a = { "./query_engine_bg.js": o }, l = new WebAssembly.Instance(s, a);
      return o.__wbg_set_wasm(l.exports), o.QueryEngine;
    })());
    let i = await ao;
    return { debugPanic() {
      return Promise.reject("{}");
    }, dmmf() {
      return Promise.resolve("{}");
    }, version() {
      return { commit: "unknown", version: "unknown" };
    }, QueryEngine: i };
  } };
  var mm = "P2036";
  var Ae = L("prisma:client:libraryEngine");
  var gl = [...Jn, "native"];
  var _r = class {
    constructor(t, r) {
      this.name = "LibraryEngine";
      this.libraryLoader = r ?? ml, t.engineWasm !== undefined && (this.libraryLoader = r ?? fl), this.config = t, this.libraryStarted = false, this.logQueries = t.logQueries ?? false, this.logLevel = t.logLevel ?? "error", this.logEmitter = t.logEmitter, this.datamodel = t.inlineSchema, t.enableDebugLogs && (this.logLevel = "debug");
      let n = Object.keys(t.overrideDatasources)[0], i = t.overrideDatasources[n]?.url;
      n !== undefined && i !== undefined && (this.datasourceOverrides = { [n]: i }), this.libraryInstantiationPromise = this.instantiateLibrary();
    }
    async applyPendingMigrations() {
      throw new Error("Cannot call this method from this type of engine instance");
    }
    async transaction(t, r, n) {
      await this.start();
      let i = JSON.stringify(r), o;
      if (t === "start") {
        let a = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel });
        o = await this.engine?.startTransaction(a, i);
      } else
        t === "commit" ? o = await this.engine?.commitTransaction(n.id, i) : t === "rollback" && (o = await this.engine?.rollbackTransaction(n.id, i));
      let s = this.parseEngineResponse(o);
      if (hm(s)) {
        let a = this.getExternalAdapterError(s);
        throw a ? a.error : new V(s.message, { code: s.error_code, clientVersion: this.config.clientVersion, meta: s.meta });
      }
      return s;
    }
    async instantiateLibrary() {
      if (Ae("internalSetup"), this.libraryInstantiationPromise)
        return this.libraryInstantiationPromise;
      Qn(), this.binaryTarget = await this.getCurrentBinaryTarget(), await this.loadEngine(), this.version();
    }
    async getCurrentBinaryTarget() {
      {
        if (this.binaryTarget)
          return this.binaryTarget;
        let t = await nt();
        if (!gl.includes(t))
          throw new R(`Unknown ${ce("PRISMA_QUERY_ENGINE_LIBRARY")} ${ce(H(t))}. Possible binaryTargets: ${qe(gl.join(", "))} or a path to the query engine library.
You may have to run ${qe("prisma generate")} for your changes to take effect.`, this.config.clientVersion);
        return t;
      }
    }
    parseEngineResponse(t) {
      if (!t)
        throw new B("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
      try {
        return JSON.parse(t);
      } catch {
        throw new B("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
      }
    }
    async loadEngine() {
      if (!this.engine) {
        this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
        try {
          let t = new WeakRef(this), { adapter: r } = this.config;
          r && Ae("Using driver adapter: %O", r), this.engine = new this.QueryEngineConstructor({ datamodel: this.datamodel, env: process.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json" }, (n) => {
            t.deref()?.logger(n);
          }, r);
        } catch (t) {
          let r = t, n = this.parseInitError(r.message);
          throw typeof n == "string" ? r : new R(n.message, this.config.clientVersion, n.error_code);
        }
      }
    }
    logger(t) {
      let r = this.parseEngineResponse(t);
      if (r) {
        if ("span" in r) {
          this.config.tracingHelper.createEngineSpan(r);
          return;
        }
        r.level = r?.level.toLowerCase() ?? "unknown", fm(r) ? this.logEmitter.emit("query", { timestamp: new Date, query: r.query, params: r.params, duration: Number(r.duration_ms), target: r.module_path }) : gm(r) ? this.loggerRustPanic = new le(lo(this, `${r.message}: ${r.reason} in ${r.file}:${r.line}:${r.column}`), this.config.clientVersion) : this.logEmitter.emit(r.level, { timestamp: new Date, message: r.message, target: r.module_path });
      }
    }
    parseInitError(t) {
      try {
        return JSON.parse(t);
      } catch {
      }
      return t;
    }
    parseRequestError(t) {
      try {
        return JSON.parse(t);
      } catch {
      }
      return t;
    }
    onBeforeExit() {
      throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
    }
    async start() {
      if (await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise)
        return Ae(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
      if (this.libraryStarted)
        return;
      let t = async () => {
        Ae("library starting");
        try {
          let r = { traceparent: this.config.tracingHelper.getTraceParent() };
          await this.engine?.connect(JSON.stringify(r)), this.libraryStarted = true, Ae("library started");
        } catch (r) {
          let n = this.parseInitError(r.message);
          throw typeof n == "string" ? r : new R(n.message, this.config.clientVersion, n.error_code);
        } finally {
          this.libraryStartingPromise = undefined;
        }
      };
      return this.libraryStartingPromise = this.config.tracingHelper.runInChildSpan("connect", t), this.libraryStartingPromise;
    }
    async stop() {
      if (await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise)
        return Ae("library is already stopping"), this.libraryStoppingPromise;
      if (!this.libraryStarted)
        return;
      let t = async () => {
        await new Promise((n) => setTimeout(n, 5)), Ae("library stopping");
        let r = { traceparent: this.config.tracingHelper.getTraceParent() };
        await this.engine?.disconnect(JSON.stringify(r)), this.libraryStarted = false, this.libraryStoppingPromise = undefined, Ae("library stopped");
      };
      return this.libraryStoppingPromise = this.config.tracingHelper.runInChildSpan("disconnect", t), this.libraryStoppingPromise;
    }
    version() {
      return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
    }
    debugPanic(t) {
      return this.library?.debugPanic(t);
    }
    async request(t, { traceparent: r, interactiveTransaction: n }) {
      Ae(`sending request, this.libraryStarted: ${this.libraryStarted}`);
      let i = JSON.stringify({ traceparent: r }), o = JSON.stringify(t);
      try {
        await this.start(), this.executingQueryPromise = this.engine?.query(o, i, n?.id), this.lastQuery = o;
        let s = this.parseEngineResponse(await this.executingQueryPromise);
        if (s.errors)
          throw s.errors.length === 1 ? this.buildQueryError(s.errors[0]) : new B(JSON.stringify(s.errors), { clientVersion: this.config.clientVersion });
        if (this.loggerRustPanic)
          throw this.loggerRustPanic;
        return { data: s, elapsed: 0 };
      } catch (s) {
        if (s instanceof R)
          throw s;
        if (s.code === "GenericFailure" && s.message?.startsWith("PANIC:"))
          throw new le(lo(this, s.message), this.config.clientVersion);
        let a = this.parseRequestError(s.message);
        throw typeof a == "string" ? s : new B(`${a.message}
${a.backtrace}`, { clientVersion: this.config.clientVersion });
      }
    }
    async requestBatch(t, { transaction: r, traceparent: n }) {
      Ae("requestBatch");
      let i = Ft(t, r);
      await this.start(), this.lastQuery = JSON.stringify(i), this.executingQueryPromise = this.engine.query(this.lastQuery, JSON.stringify({ traceparent: n }), pl(r));
      let o = await this.executingQueryPromise, s = this.parseEngineResponse(o);
      if (s.errors)
        throw s.errors.length === 1 ? this.buildQueryError(s.errors[0]) : new B(JSON.stringify(s.errors), { clientVersion: this.config.clientVersion });
      let { batchResult: a, errors: l } = s;
      if (Array.isArray(a))
        return a.map((u) => u.errors && u.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(u.errors[0]) : { data: u, elapsed: 0 });
      throw l && l.length === 1 ? new Error(l[0].error) : new Error(JSON.stringify(s));
    }
    buildQueryError(t) {
      if (t.user_facing_error.is_panic)
        return new le(lo(this, t.user_facing_error.message), this.config.clientVersion);
      let r = this.getExternalAdapterError(t.user_facing_error);
      return r ? r.error : st(t, this.config.clientVersion, this.config.activeProvider);
    }
    getExternalAdapterError(t) {
      if (t.error_code === mm && this.config.adapter) {
        let r = t.meta?.id;
        Yr(typeof r == "number", "Malformed external JS error received from the engine");
        let n = this.config.adapter.errorRegistry.consumeError(r);
        return Yr(n, "External error with reported id was not registered"), n;
      }
    }
    async metrics(t) {
      await this.start();
      let r = await this.engine.metrics(JSON.stringify(t));
      return t.format === "prometheus" ? r : this.parseEngineResponse(r);
    }
  };
  var yl = (e) => ({ command: e });
  var bl = (e) => e.strings.reduce((t, r, n) => `${t}@P${n}${r}`);
  var bm = ["$connect", "$disconnect", "$on", "$transaction", "$use", "$extends"];
  var vl = bm;
  var Em = /^(\s*alter\s)/i;
  var Tl = L("prisma:client");
  var co = ({ clientMethod: e, activeProvider: t }) => (r) => {
    let n = "", i;
    if (pa(r))
      n = r.sql, i = { values: jt(r.values), __prismaRawParameters__: true };
    else if (Array.isArray(r)) {
      let [o, ...s] = r;
      n = o, i = { values: jt(s || []), __prismaRawParameters__: true };
    } else
      switch (t) {
        case "sqlite":
        case "mysql": {
          n = r.sql, i = { values: jt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = r.text, i = { values: jt(r.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = bl(r), i = { values: jt(r.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${t} provider does not support ${e}`);
      }
    return i?.values ? Tl(`prisma.${e}(${n}, ${i.values})`) : Tl(`prisma.${e}(${n})`), { query: n, parameters: i };
  };
  var Rl = { requestArgsToMiddlewareArgs(e) {
    return [e.strings, ...e.values];
  }, middlewareArgsToRequestArgs(e) {
    let [t, ...r] = e;
    return new oe(t, r);
  } };
  var Cl = { requestArgsToMiddlewareArgs(e) {
    return [e];
  }, middlewareArgsToRequestArgs(e) {
    return e[0];
  } };
  var Al = { isEnabled() {
    return false;
  }, getTraceParent() {
    return "00-10-10-00";
  }, async createEngineSpan() {
  }, getActiveContext() {
  }, runInChildSpan(e, t) {
    return t();
  } };
  var mo = class {
    isEnabled() {
      return this.getGlobalTracingHelper().isEnabled();
    }
    getTraceParent(t) {
      return this.getGlobalTracingHelper().getTraceParent(t);
    }
    createEngineSpan(t) {
      return this.getGlobalTracingHelper().createEngineSpan(t);
    }
    getActiveContext() {
      return this.getGlobalTracingHelper().getActiveContext();
    }
    runInChildSpan(t, r) {
      return this.getGlobalTracingHelper().runInChildSpan(t, r);
    }
    getGlobalTracingHelper() {
      return globalThis.PRISMA_INSTRUMENTATION?.helper ?? Al;
    }
  };
  var Ln = class {
    constructor() {
      this._middlewares = [];
    }
    use(t) {
      this._middlewares.push(t);
    }
    get(t) {
      return this._middlewares[t];
    }
    has(t) {
      return !!this._middlewares[t];
    }
    length() {
      return this._middlewares.length;
    }
  };
  var Fl = k(bi());
  var wm = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateOne: true, upsertOne: true };
  var Mn = class {
    constructor(t) {
      this.options = t;
      this.tickActive = false;
      this.batches = {};
    }
    request(t) {
      let r = this.options.batchBy(t);
      return r ? (this.batches[r] || (this.batches[r] = [], this.tickActive || (this.tickActive = true, process.nextTick(() => {
        this.dispatchBatches(), this.tickActive = false;
      }))), new Promise((n, i) => {
        this.batches[r].push({ request: t, resolve: n, reject: i });
      })) : this.options.singleLoader(t);
    }
    dispatchBatches() {
      for (let t in this.batches) {
        let r = this.batches[t];
        delete this.batches[t], r.length === 1 ? this.options.singleLoader(r[0].request).then((n) => {
          n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
        }).catch((n) => {
          r[0].reject(n);
        }) : (r.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(r.map((n) => n.request)).then((n) => {
          if (n instanceof Error)
            for (let i = 0;i < r.length; i++)
              r[i].reject(n);
          else
            for (let i = 0;i < r.length; i++) {
              let o = n[i];
              o instanceof Error ? r[i].reject(o) : r[i].resolve(o);
            }
        }).catch((n) => {
          for (let i = 0;i < r.length; i++)
            r[i].reject(n);
        }));
      }
    }
    get [Symbol.toStringTag]() {
      return "DataLoader";
    }
  };
  var Pm = L("prisma:client:request_handler");
  var $n = class {
    constructor(t, r) {
      this.logEmitter = r, this.client = t, this.dataloader = new Mn({ batchLoader: Ma(async ({ requests: n, customDataProxyFetch: i }) => {
        let { transaction: o, otelParentCtx: s } = n[0], a = n.map((p) => p.protocolQuery), l = this.client._tracingHelper.getTraceParent(s), u = n.some((p) => go(p.protocolQuery.action));
        return (await this.client._engine.requestBatch(a, { traceparent: l, transaction: vm(o), containsWrite: u, customDataProxyFetch: i })).map((p, d) => {
          if (p instanceof Error)
            return p;
          try {
            return this.mapQueryEngineResult(n[d], p);
          } catch (f) {
            return f;
          }
        });
      }), singleLoader: async (n) => {
        let i = n.transaction?.kind === "itx" ? Ll(n.transaction) : undefined, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: go(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
        return this.mapQueryEngineResult(n, o);
      }, batchBy: (n) => n.transaction?.id ? `transaction-${n.transaction.id}` : Dl(n.protocolQuery), batchOrder(n, i) {
        return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
      } });
    }
    async request(t) {
      try {
        return await this.dataloader.request(t);
      } catch (r) {
        let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = t;
        this.handleAndLogRequestError({ error: r, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: t.globalOmit });
      }
    }
    mapQueryEngineResult({ dataPath: t, unpacker: r }, n) {
      let i = n?.data, o = n?.elapsed, s = this.unpack(i, t, r);
      return process.env.PRISMA_CLIENT_GET_TIME ? { data: s, elapsed: o } : s;
    }
    handleAndLogRequestError(t) {
      try {
        this.handleRequestError(t);
      } catch (r) {
        throw this.logEmitter && this.logEmitter.emit("error", { message: r.message, target: t.clientMethod, timestamp: new Date }), r;
      }
    }
    handleRequestError({ error: t, clientMethod: r, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
      if (Pm(t), Tm(t, i) || t instanceof Le)
        throw t;
      if (t instanceof V && Rm(t)) {
        let u = Nl(t.meta);
        wn({ args: o, errors: [u], callsite: n, errorFormat: this.client._errorFormat, originalMethod: r, clientVersion: this.client._clientVersion, globalOmit: a });
      }
      let l = t.message;
      if (n && (l = Tt({ callsite: n, originalMethod: r, isPanic: t.isPanic, showColors: this.client._errorFormat === "pretty", message: l })), l = this.sanitizeMessage(l), t.code) {
        let u = s ? { modelName: s, ...t.meta } : t.meta;
        throw new V(l, { code: t.code, clientVersion: this.client._clientVersion, meta: u, batchRequestIdx: t.batchRequestIdx });
      } else {
        if (t.isPanic)
          throw new le(l, this.client._clientVersion);
        if (t instanceof B)
          throw new B(l, { clientVersion: this.client._clientVersion, batchRequestIdx: t.batchRequestIdx });
        if (t instanceof R)
          throw new R(l, this.client._clientVersion);
        if (t instanceof le)
          throw new le(l, this.client._clientVersion);
      }
      throw t.clientVersion = this.client._clientVersion, t;
    }
    sanitizeMessage(t) {
      return this.client._errorFormat && this.client._errorFormat !== "pretty" ? (0, Fl.default)(t) : t;
    }
    unpack(t, r, n) {
      if (!t || (t.data && (t = t.data), !t))
        return t;
      let i = Object.keys(t)[0], o = Object.values(t)[0], s = r.filter((u) => u !== "select" && u !== "include"), a = Gi(o, s), l = i === "queryRaw" ? _l(a) : wt(a);
      return n ? n(l) : l;
    }
    get [Symbol.toStringTag]() {
      return "RequestHandler";
    }
  };
  var Ml = "5.22.0";
  var $l = Ml;
  var Ul = k(Ai());
  var F = class extends Error {
    constructor(t) {
      super(t + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientConstructorValidationError";
    }
  };
  w(F, "PrismaClientConstructorValidationError");
  var ql = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
  var jl = ["pretty", "colorless", "minimal"];
  var Vl = ["info", "query", "warn", "error"];
  var Sm = { datasources: (e, { datasourceNames: t }) => {
    if (e) {
      if (typeof e != "object" || Array.isArray(e))
        throw new F(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);
      for (let [r, n] of Object.entries(e)) {
        if (!t.includes(r)) {
          let i = Vt(r, t) || ` Available datasources: ${t.join(", ")}`;
          throw new F(`Unknown datasource ${r} provided to PrismaClient constructor.${i}`);
        }
        if (typeof n != "object" || Array.isArray(n))
          throw new F(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
        if (n && typeof n == "object")
          for (let [i, o] of Object.entries(n)) {
            if (i !== "url")
              throw new F(`Invalid value ${JSON.stringify(e)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string")
              throw new F(`Invalid value ${JSON.stringify(o)} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
      }
    }
  }, adapter: (e, t) => {
    if (e === null)
      return;
    if (e === undefined)
      throw new F('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
    if (!Fn(t).includes("driverAdapters"))
      throw new F('"adapter" property can only be provided to PrismaClient constructor when "driverAdapters" preview feature is enabled.');
    if (Yt() === "binary")
      throw new F('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
  }, datasourceUrl: (e) => {
    if (typeof e < "u" && typeof e != "string")
      throw new F(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
  }, errorFormat: (e) => {
    if (e) {
      if (typeof e != "string")
        throw new F(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);
      if (!jl.includes(e)) {
        let t = Vt(e, jl);
        throw new F(`Invalid errorFormat ${e} provided to PrismaClient constructor.${t}`);
      }
    }
  }, log: (e) => {
    if (!e)
      return;
    if (!Array.isArray(e))
      throw new F(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);
    function t(r) {
      if (typeof r == "string" && !Vl.includes(r)) {
        let n = Vt(r, Vl);
        throw new F(`Invalid log level "${r}" provided to PrismaClient constructor.${n}`);
      }
    }
    for (let r of e) {
      t(r);
      let n = { level: t, emit: (i) => {
        let o = ["stdout", "event"];
        if (!o.includes(i)) {
          let s = Vt(i, o);
          throw new F(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
        }
      } };
      if (r && typeof r == "object")
        for (let [i, o] of Object.entries(r))
          if (n[i])
            n[i](o);
          else
            throw new F(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
    }
  }, transactionOptions: (e) => {
    if (!e)
      return;
    let t = e.maxWait;
    if (t != null && t <= 0)
      throw new F(`Invalid value ${t} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
    let r = e.timeout;
    if (r != null && r <= 0)
      throw new F(`Invalid value ${r} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
  }, omit: (e, t) => {
    if (typeof e != "object")
      throw new F('"omit" option is expected to be an object.');
    if (e === null)
      throw new F('"omit" option can not be `null`');
    let r = [];
    for (let [n, i] of Object.entries(e)) {
      let o = Im(n, t.runtimeDataModel);
      if (!o) {
        r.push({ kind: "UnknownModel", modelKey: n });
        continue;
      }
      for (let [s, a] of Object.entries(i)) {
        let l = o.fields.find((u) => u.name === s);
        if (!l) {
          r.push({ kind: "UnknownField", modelKey: n, fieldName: s });
          continue;
        }
        if (l.relationName) {
          r.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
          continue;
        }
        typeof a != "boolean" && r.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
      }
    }
    if (r.length > 0)
      throw new F(Om(e, r));
  }, __internal: (e) => {
    if (!e)
      return;
    let t = ["debug", "engine", "configOverride"];
    if (typeof e != "object")
      throw new F(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);
    for (let [r] of Object.entries(e))
      if (!t.includes(r)) {
        let n = Vt(r, t);
        throw new F(`Invalid property ${JSON.stringify(r)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
  } };
  var tt = L("prisma:client");
  typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
  var km = { requestArgsToMiddlewareArgs: (e) => e, middlewareArgsToRequestArgs: (e) => e };
  var Dm = Symbol.for("prisma.client.transaction.id");
  var _m = { id: 0, nextId() {
    return ++this.id;
  } };
  var Lm = new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
  /*! Bundled license information:
  
  decimal.js/decimal.mjs:
    (*!
     *  decimal.js v10.4.3
     *  An arbitrary-precision Decimal type for JavaScript.
     *  https://github.com/MikeMcl/decimal.js
     *  Copyright (c) 2022 Michael Mclaughlin <M8ch88l@gmail.com>
     *  MIT Licence
     *)
  */
});

// node_modules/.prisma/client/index.js
var require_client2 = __commonJS((exports) => {
  var __dirname = "C:\\Users\\Orlando\\OneDrive\\Escritorio\\hono-app-server\\node_modules\\.prisma\\client";
  Object.defineProperty(exports, "__esModule", { value: true });
  var {
    PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
    PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
    PrismaClientRustPanicError: PrismaClientRustPanicError2,
    PrismaClientInitializationError: PrismaClientInitializationError2,
    PrismaClientValidationError: PrismaClientValidationError2,
    NotFoundError: NotFoundError2,
    getPrismaClient: getPrismaClient2,
    sqltag: sqltag2,
    empty: empty2,
    join: join2,
    raw: raw3,
    skip: skip2,
    Decimal: Decimal2,
    Debug: Debug2,
    objectEnumValues: objectEnumValues2,
    makeStrictEnum: makeStrictEnum2,
    Extensions: Extensions2,
    warnOnce: warnOnce2,
    defineDmmfProperty: defineDmmfProperty2,
    Public: Public2,
    getRuntime: getRuntime2
  } = require_library();
  var Prisma = {};
  exports.Prisma = Prisma;
  exports.$Enums = {};
  Prisma.prismaVersion = {
    client: "5.22.0",
    engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
  };
  Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
  Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
  Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError2;
  Prisma.PrismaClientInitializationError = PrismaClientInitializationError2;
  Prisma.PrismaClientValidationError = PrismaClientValidationError2;
  Prisma.NotFoundError = NotFoundError2;
  Prisma.Decimal = Decimal2;
  Prisma.sql = sqltag2;
  Prisma.empty = empty2;
  Prisma.join = join2;
  Prisma.raw = raw3;
  Prisma.validator = Public2.validator;
  Prisma.getExtensionContext = Extensions2.getExtensionContext;
  Prisma.defineExtension = Extensions2.defineExtension;
  Prisma.DbNull = objectEnumValues2.instances.DbNull;
  Prisma.JsonNull = objectEnumValues2.instances.JsonNull;
  Prisma.AnyNull = objectEnumValues2.instances.AnyNull;
  Prisma.NullTypes = {
    DbNull: objectEnumValues2.classes.DbNull,
    JsonNull: objectEnumValues2.classes.JsonNull,
    AnyNull: objectEnumValues2.classes.AnyNull
  };
  var path = import.meta.require("path");
  exports.Prisma.TransactionIsolationLevel = makeStrictEnum2({
    Serializable: "Serializable"
  });
  exports.Prisma.TasksScalarFieldEnum = {
    id: "id",
    title: "title",
    description: "description",
    createAt: "createAt"
  };
  exports.Prisma.SortOrder = {
    asc: "asc",
    desc: "desc"
  };
  exports.Prisma.NullsOrder = {
    first: "first",
    last: "last"
  };
  exports.Prisma.ModelName = {
    Tasks: "Tasks"
  };
  var config2 = {
    generator: {
      name: "client",
      provider: {
        fromEnvVar: null,
        value: "prisma-client-js"
      },
      output: {
        value: "C:\\Users\\Orlando\\OneDrive\\Escritorio\\hono-app-server\\node_modules\\@prisma\\client",
        fromEnvVar: null
      },
      config: {
        engineType: "library"
      },
      binaryTargets: [
        {
          fromEnvVar: null,
          value: "windows",
          native: true
        }
      ],
      previewFeatures: [],
      sourceFilePath: "C:\\Users\\Orlando\\OneDrive\\Escritorio\\hono-app-server\\prisma\\schema.prisma"
    },
    relativeEnvPaths: {
      rootEnvPath: null,
      schemaEnvPath: "../../../.env"
    },
    relativePath: "../../../prisma",
    clientVersion: "5.22.0",
    engineVersion: "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
    datasourceNames: [
      "db"
    ],
    activeProvider: "sqlite",
    inlineDatasources: {
      db: {
        url: {
          fromEnvVar: "DATABASE_URL",
          value: null
        }
      }
    },
    inlineSchema: "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\ndatasource db {\n  provider = \"sqlite\"\n  url      = env(\"DATABASE_URL\")\n}\n\nmodel Tasks {\n  id          Int     @id @default(autoincrement())\n  title       String\n  description String?\n\n  createAt DateTime @default(now())\n}\n",
    inlineSchemaHash: "c5bd394dd53de7c34d6441dde4aa2ff04042b52cade05718f278fc4475834375",
    copyEngine: true
  };
  var fs = import.meta.require("fs");
  config2.dirname = __dirname;
  if (!fs.existsSync(path.join(__dirname, "schema.prisma"))) {
    const alternativePaths = [
      "node_modules/.prisma/client",
      ".prisma/client"
    ];
    const alternativePath = alternativePaths.find((altPath) => {
      return fs.existsSync(path.join(process.cwd(), altPath, "schema.prisma"));
    }) ?? alternativePaths[0];
    config2.dirname = path.join(process.cwd(), alternativePath);
    config2.isBundled = true;
  }
  config2.runtimeDataModel = JSON.parse("{\"models\":{\"Tasks\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{},\"types\":{}}");
  defineDmmfProperty2(exports.Prisma, config2.runtimeDataModel);
  config2.engineWasm = undefined;
  var { warnEnvConflicts: warnEnvConflicts2 } = require_library();
  warnEnvConflicts2({
    rootEnvPath: config2.relativeEnvPaths.rootEnvPath && path.resolve(config2.dirname, config2.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config2.relativeEnvPaths.schemaEnvPath && path.resolve(config2.dirname, config2.relativeEnvPaths.schemaEnvPath)
  });
  var PrismaClient = getPrismaClient2(config2);
  exports.PrismaClient = PrismaClient;
  Object.assign(exports, Prisma);
  path.join(__dirname, "query_engine-windows.dll.node");
  path.join(process.cwd(), "node_modules/.prisma/client/query_engine-windows.dll.node");
  path.join(__dirname, "schema.prisma");
  path.join(process.cwd(), "node_modules/.prisma/client/schema.prisma");
});

// node_modules/.prisma/client/default.js
var require_default = __commonJS((exports, module) => {
  module.exports = { ...require_client2() };
});

// node_modules/@prisma/client/default.js
var require_default2 = __commonJS((exports, module) => {
  module.exports = {
    ...require_default()
  };
});

// node_modules/hono/dist/utils/body.js
async function parseFormData(request2, options) {
  const formData = await request2.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var parseBody = async (request2, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request2 instanceof HonoRequest ? request2.raw.headers : request2.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request2, { all, dot });
  }
  return {};
};
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== undefined) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    form[key] = value;
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1;i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1;j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request2) => {
  const url = request2.url;
  const start = url.indexOf("/", 8);
  let i = start;
  for (;i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? undefined : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request2) => {
  const result = getPath(request2);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
};
var mergePath = (...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
};
var checkOptionalParameter = (path) => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? decodeURIComponent_(value) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request2, path = "/", matchResult = [[]]) {
    this.raw = request2;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : undefined;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? undefined;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body2) => {
        if (anyCachedKey === "json") {
          body2 = JSON.stringify(body2);
        }
        return new Response(body2)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.#cachedBody("json");
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw2 = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) {
    return raw2(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = (headers, map = {}) => {
  for (const key of Object.keys(map)) {
    headers.set(key, map[key]);
  }
  return headers;
};
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status = 200;
  #executionCtx;
  #headers;
  #preparedHeaders;
  #res;
  #isFresh = true;
  #layout;
  #renderer;
  #notFoundHandler;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    this.#isFresh = false;
    return this.#res ||= new Response("404 Not Found", { status: 404 });
  }
  set res(_res) {
    this.#isFresh = false;
    if (this.#res && _res) {
      try {
        for (const [k, v] of this.#res.headers.entries()) {
          if (k === "content-type") {
            continue;
          }
          if (k === "set-cookie") {
            const cookies = this.#res.headers.getSetCookie();
            _res.headers.delete("set-cookie");
            for (const cookie of cookies) {
              _res.headers.append("set-cookie", cookie);
            }
          } else {
            _res.headers.set(k, v);
          }
        }
      } catch (e) {
        if (e instanceof TypeError && e.message.includes("immutable")) {
          this.res = new Response(_res.body, {
            headers: _res.headers,
            status: _res.status
          });
          return;
        } else {
          throw e;
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (value === undefined) {
      if (this.#headers) {
        this.#headers.delete(name);
      } else if (this.#preparedHeaders) {
        delete this.#preparedHeaders[name.toLocaleLowerCase()];
      }
      if (this.finalized) {
        this.res.headers.delete(name);
      }
      return;
    }
    if (options?.append) {
      if (!this.#headers) {
        this.#isFresh = false;
        this.#headers = new Headers(this.#preparedHeaders);
        this.#preparedHeaders = {};
      }
      this.#headers.append(name, value);
    } else {
      if (this.#headers) {
        this.#headers.set(name, value);
      } else {
        this.#preparedHeaders ??= {};
        this.#preparedHeaders[name.toLowerCase()] = value;
      }
    }
    if (this.finalized) {
      if (options?.append) {
        this.res.headers.append(name, value);
      } else {
        this.res.headers.set(name, value);
      }
    }
  };
  status = (status) => {
    this.#isFresh = false;
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map;
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : undefined;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    if (this.#isFresh && !headers && !arg && this.#status === 200) {
      return new Response(data, {
        headers: this.#preparedHeaders
      });
    }
    if (arg && typeof arg !== "number") {
      const header = new Headers(arg.headers);
      if (this.#headers) {
        this.#headers.forEach((v, k) => {
          if (k === "set-cookie") {
            header.append(k, v);
          } else {
            header.set(k, v);
          }
        });
      }
      const headers2 = setHeaders(header, this.#preparedHeaders);
      return new Response(data, {
        headers: headers2,
        status: arg.status ?? this.#status
      });
    }
    const status = typeof arg === "number" ? arg : this.#status;
    this.#preparedHeaders ??= {};
    this.#headers ??= new Headers;
    setHeaders(this.#headers, this.#preparedHeaders);
    if (this.#res) {
      this.#res.headers.forEach((v, k) => {
        if (k === "set-cookie") {
          this.#headers?.append(k, v);
        } else {
          this.#headers?.set(k, v);
        }
      });
      setHeaders(this.#headers, this.#preparedHeaders);
    }
    headers ??= {};
    for (const [k, v] of Object.entries(headers)) {
      if (typeof v === "string") {
        this.#headers.set(k, v);
      } else {
        this.#headers.delete(k);
        for (const v2 of v) {
          this.#headers.append(k, v2);
        }
      }
    }
    return new Response(data, {
      status,
      headers: this.#headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => {
    return typeof arg === "number" ? this.#newResponse(data, arg, headers) : this.#newResponse(data, arg);
  };
  text = (text, arg, headers) => {
    if (!this.#preparedHeaders) {
      if (this.#isFresh && !headers && !arg) {
        return new Response(text);
      }
      this.#preparedHeaders = {};
    }
    this.#preparedHeaders["content-type"] = TEXT_PLAIN;
    return typeof arg === "number" ? this.#newResponse(text, arg, headers) : this.#newResponse(text, arg);
  };
  json = (object, arg, headers) => {
    const body2 = JSON.stringify(object);
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "application/json; charset=UTF-8";
    return typeof arg === "number" ? this.#newResponse(body2, arg, headers) : this.#newResponse(body2, arg);
  };
  html = (html2, arg, headers) => {
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "text/html; charset=UTF-8";
    if (typeof html2 === "object") {
      return resolveCallback(html2, HtmlEscapedCallbackPhase.Stringify, false, {}).then((html22) => {
        return typeof arg === "number" ? this.#newResponse(html22, arg, headers) : this.#newResponse(html22, arg);
      });
    }
    return typeof arg === "number" ? this.#newResponse(html2, arg, headers) : this.#newResponse(html2, arg);
  };
  redirect = (location, status) => {
    this.#headers ??= new Headers;
    this.#headers.set("Location", String(location));
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response;
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context2, next) => {
    let index = -1;
    const isContext = context2 instanceof Context;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (isContext) {
          context2.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || undefined;
      }
      if (!handler) {
        if (isContext && context2.finalized === false && onNotFound) {
          res = await onNotFound(context2);
        }
      } else {
        try {
          res = await handler(context2, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && isContext && onError) {
            context2.error = err;
            res = await onError(err, context2);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context2.finalized === false || isError)) {
        context2.res = res;
      }
      return context2;
    }
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/hono-base.js
var COMPOSED_HANDLER = Symbol("composedHandler");
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    return err.getResponse();
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          if (typeof handler !== "string") {
            this.#addRoute(method, this.#path, handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  #errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.#errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.#errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.#errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        replaceRequest = options.replaceRequest;
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = undefined;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request3) => {
        const url3 = new URL(request3.url);
        url3.pathname = url3.pathname.slice(pathPrefixLength) || "/";
        return new Request(url3, request3);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.#errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request3, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request3, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request3, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request3, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.#errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context3 = await composed(c);
        if (!context3.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return context3.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request3, ...rest) => {
    return this.#dispatch(request3, rest[1], rest[0], request3.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      if (requestInit !== undefined) {
        input = new Request(input, requestInit);
      }
      return this.fetch(input, Env, executionCtx);
    }
    input = input.toString();
    const path = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
    const req = new Request(path, requestInit);
    return this.fetch(req, Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, undefined, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/node.js
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
var Node = class {
  index;
  varIndex;
  children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context3, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== undefined) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (Object.keys(this.children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node;
        if (name !== "") {
          node.varIndex = context3.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (Object.keys(this.children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node;
      }
    }
    node.insert(restTokens, index, paramMap, context3, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.children[k];
      return (typeof c.varIndex === "number" ? `(${k})@${c.varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  context = { varIndex: 0 };
  root = new Node;
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0;; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1;j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== undefined) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== undefined) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}\$`);
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie2 = new Trie;
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length;i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie2.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (;paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie2.buildRegExp();
  for (let i = 0, len = handlerData.length;i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length;k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return;
}
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
var RegExpRouter = class {
  name = "RegExpRouter";
  middleware;
  routes;
  constructor() {
    this.middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length;i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.routes).concat(Object.keys(this.middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.middleware = this.routes = undefined;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]]));
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  routers = [];
  routes = [];
  constructor(init) {
    Object.assign(this, init);
  }
  add(method, path, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (;i < len; i++) {
      const router5 = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length;i2 < len2; i2++) {
          router5.add(...routes[i2]);
        }
        res = router5.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router5.match.bind(router5);
      this.routers = [router5];
      this.routes = undefined;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var Node2 = class {
  methods;
  children;
  patterns;
  order = 0;
  params = /* @__PURE__ */ Object.create(null);
  constructor(method, handler, children) {
    this.children = children || /* @__PURE__ */ Object.create(null);
    this.methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path, handler) {
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length;i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2;
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = /* @__PURE__ */ Object.create(null);
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  #gHSets(node3, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node3.methods.length;i < len; i++) {
      const m = node3.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = /* @__PURE__ */ Object.create(null);
      if (handlerSet !== undefined) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        for (let i2 = 0, len2 = handlerSet.possibleKeys.length;i2 < len2; i2++) {
          const key = handlerSet.possibleKeys[i2];
          const processed = processedSet[handlerSet.score];
          handlerSet.params[key] = params[key] && !processed ? params[key] : nodeParams[key] ?? params[key];
          processedSet[handlerSet.score] = true;
        }
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.params = /* @__PURE__ */ Object.create(null);
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length;i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length;j < len2; j++) {
        const node3 = curNodes[j];
        const nextNode = node3.children[part];
        if (nextNode) {
          nextNode.params = node3.params;
          if (isLast) {
            if (nextNode.children["*"]) {
              handlerSets.push(...this.#gHSets(nextNode.children["*"], method, node3.params, /* @__PURE__ */ Object.create(null)));
            }
            handlerSets.push(...this.#gHSets(nextNode, method, node3.params, /* @__PURE__ */ Object.create(null)));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node3.patterns.length;k < len3; k++) {
          const pattern = node3.patterns[k];
          const params = { ...node3.params };
          if (pattern === "*") {
            const astNode = node3.children["*"];
            if (astNode) {
              handlerSets.push(...this.#gHSets(astNode, method, node3.params, /* @__PURE__ */ Object.create(null)));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node3.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.#gHSets(child, method, node3.params, params));
            continue;
          }
          if (matcher === true || matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast) {
                handlerSets.push(...this.#gHSets(child, method, params, node3.params));
                if (child.children["*"]) {
                  handlerSets.push(...this.#gHSets(child.children["*"], method, params, node3.params));
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  node;
  constructor() {
    this.node = new Node2;
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length;i < len; i++) {
        this.node.insert(method, results[i], handler);
      }
      return;
    }
    this.node.insert(method, path, handler);
  }
  match(method, path) {
    return this.node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter, new TrieRouter]
    });
  }
};

// node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno } = globalThis;
  const isNoColor = typeof Deno?.noColor === "boolean" ? Deno.noColor : process2 !== undefined ? "NO_COLOR" in process2?.env : false;
  return !isNoColor;
}

// node_modules/hono/dist/middleware/logger/index.js
function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `${prefix} ${method} ${path}` : `${prefix} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
  fn(out);
}
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1000 ? delta + "ms" : Math.round(delta / 1000) + "s"]);
};
var colorStatus = (status) => {
  const colorEnabled = getColorEnabled();
  if (colorEnabled) {
    switch (status / 100 | 0) {
      case 5:
        return `\x1B[31m${status}\x1B[0m`;
      case 4:
        return `\x1B[33m${status}\x1B[0m`;
      case 3:
        return `\x1B[36m${status}\x1B[0m`;
      case 2:
        return `\x1B[32m${status}\x1B[0m`;
    }
  }
  return `${status}`;
};
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method } = c.req;
    const path = getPath(c.req.raw);
    log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// node_modules/hono/dist/middleware/pretty-json/index.js
var prettyJSON = (options) => {
  const targetQuery = options?.query ?? "pretty";
  return async function prettyJSON2(c, next) {
    const pretty = c.req.query(targetQuery) || c.req.query(targetQuery) === "";
    await next();
    if (pretty && c.res.headers.get("Content-Type")?.startsWith("application/json")) {
      const obj = await c.res.json();
      c.res = new Response(JSON.stringify(obj, null, options?.space ?? 2), c.res);
    }
  };
};

// node_modules/hono/dist/middleware/timing/timing.js
var getTime = () => {
  try {
    return performance.now();
  } catch {
  }
  return Date.now();
};
var timing = (config2) => {
  const options = {
    total: true,
    enabled: true,
    totalDescription: "Total Response Time",
    autoEnd: true,
    crossOrigin: false,
    ...config2
  };
  return async function timing2(c, next) {
    const headers = [];
    const timers = /* @__PURE__ */ new Map;
    if (c.get("metric")) {
      return await next();
    }
    c.set("metric", { headers, timers });
    if (options.total) {
      startTime(c, "total", options.totalDescription);
    }
    await next();
    if (options.total) {
      endTime(c, "total");
    }
    if (options.autoEnd) {
      timers.forEach((_, key) => endTime(c, key));
    }
    const enabled = typeof options.enabled === "function" ? options.enabled(c) : options.enabled;
    if (enabled) {
      c.res.headers.append("Server-Timing", headers.join(","));
      const crossOrigin = typeof options.crossOrigin === "function" ? options.crossOrigin(c) : options.crossOrigin;
      if (crossOrigin) {
        c.res.headers.append("Timing-Allow-Origin", typeof crossOrigin === "string" ? crossOrigin : "*");
      }
    }
  };
};
var setMetric = (c, name, valueDescription, description, precision) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  if (typeof valueDescription === "number") {
    const dur = valueDescription.toFixed(precision || 1);
    const metric = description ? `${name};dur=${dur};desc="${description}"` : `${name};dur=${dur}`;
    metrics.headers.push(metric);
  } else {
    const metric = valueDescription ? `${name};desc="${valueDescription}"` : `${name}`;
    metrics.headers.push(metric);
  }
};
var startTime = (c, name, description) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  metrics.timers.set(name, { description, start: getTime() });
};
var endTime = (c, name, precision) => {
  const metrics = c.get("metric");
  if (!metrics) {
    console.warn("Metrics not initialized! Please add the `timing()` middleware to this route!");
    return;
  }
  const timer = metrics.timers.get(name);
  if (!timer) {
    console.warn(`Timer "${name}" does not exist!`);
    return;
  }
  const { description, start } = timer;
  const duration = getTime() - start;
  setMetric(c, name, duration, description, precision);
  metrics.timers.delete(name);
};

// src/libs/redis.ts
var import_redis = __toESM(require_dist7(), 1);
async function ConnectRedis() {
  if (redisClient) {
    console.log("Conexi\xF3n reutlizada");
    return redisClient;
  }
  console.log("Nueva conexi\xF3n", redisClient);
  try {
    redisClient = import_redis.createClient();
    redisClient.on("error", (err) => {
      console.error("Redis Client Error: " + err);
    });
    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.error("Error al conectar a Redis:", err);
    throw new Error("No se pudo conectar a Redis.");
  }
}
var redisClient = null;

// src/services/tasks.service.ts
var client2 = __toESM(require_default2(), 1);

// src/libs/prisma.ts
var client = __toESM(require_default2(), 1);
var prisma = new client.PrismaClient;

// src/services/tasks.service.ts
async function findAll() {
  try {
    const client3 = await ConnectRedis();
    const reply = await client3.get("tasks");
    const tasks = await prisma.tasks.findMany();
    await client3.set("tasks", JSON.stringify(tasks), {
      EX: 15,
      NX: true
    });
    return { reply, tasks };
  } catch (error) {
    if (error instanceof client2.Prisma.PrismaClientInitializationError) {
      const meesage = error.message + error.errorCode;
      throw new Error(meesage);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Error while getting tasks");
  }
}
async function create({
  title,
  description
}) {
  try {
    const newTask = await prisma.tasks.create({
      data: {
        title,
        description
      }
    });
    return newTask;
  } catch (error) {
    if (error instanceof client2.Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error(error.message);
      }
    }
  }
}
async function findOne(id) {
  try {
    const client3 = await ConnectRedis();
    const reply = await client3.get(id);
    const taskFound = await prisma.tasks.findUnique({
      where: {
        id: Number(id)
      }
    });
    await client3.set(id, JSON.stringify(taskFound), {
      EX: 15,
      NX: true
    });
    return { reply, taskFound };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error(err.message);
    }
    throw new Error("Error getting task information");
  }
}
async function remove(id) {
  try {
    const taskFound = await prisma.tasks.delete({
      where: {
        id: Number(id)
      }
    });
    return taskFound;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Error deleting task information");
  }
}
async function updated({
  id,
  title,
  description
}) {
  try {
    const updatedTasks = await prisma.tasks.update({
      where: {
        id: Number(id)
      },
      data: {
        title,
        description
      }
    });
    return updatedTasks;
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error(err.message);
    }
    throw new Error("Error updating task");
  }
}

// src/controllers/tasks.controller.ts
async function getAllTasks(c) {
  const { reply, tasks: tasks2 } = await findAll();
  if (reply) {
    return c.json(JSON.parse(reply), 200);
  }
  return c.json(tasks2, 200);
}
async function createTasks(c) {
  const { title, description } = await c.req.json();
  if (!title || !description) {
    return c.json({ msg: "Title and description is required" }, 400);
  }
  const newTask = await create({ title, description });
  return c.json(newTask, 201);
}
async function getTask(c) {
  const { id } = c.req.param();
  const { reply, taskFound } = await findOne(id);
  if (reply) {
    return c.json(reply, 200);
  }
  if (!taskFound) {
    return c.json({ msg: "Task not found" }, 404);
  }
  return c.json(taskFound, 200);
}
async function deleteTask(c) {
  const { id } = c.req.param();
  const taskFound = await remove(id);
  if (!taskFound) {
    return c.json({ msg: "Task not found" }, 404);
  }
  return c.json(taskFound, 204);
}
async function updatedTask(c) {
  const { id } = c.req.param();
  const { title, description } = await c.req.json();
  if (!title || !description) {
    return c.json({ msg: "Title and description is required" }, 400);
  }
  const updatedTasks = await updated({ id, title, description });
  return c.json(updatedTasks);
}

// src/routes/tasks-routes.ts
var taskRouter = new Hono2;
taskRouter.get("/", getAllTasks);
taskRouter.post("/", createTasks);
taskRouter.get("/:id", getTask);
taskRouter.delete("/:id", deleteTask);
taskRouter.put("/:id", updatedTask);
var tasks_routes_default = taskRouter;

// src/index.ts
var app = new Hono2;
(async () => {
  try {
    await ConnectRedis();
    console.log("Conexi\xF3n a Redis establecida correctamente.");
    app.use(logger());
    app.use(prettyJSON());
    app.use(timing());
    app.route("/", tasks_routes_default);
  } catch (error) {
    console.error("Error al conectar a Redis:", error);
    process.exit(1);
  }
})();
var src_default = app;
export {
  src_default as default
};
