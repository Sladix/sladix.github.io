import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.1";

let seedString = "lool";
let iterOffset, seedOffset, simplex, ns;
ns = 2;
seed(seedString);

function getParralelPoints(basePath, distance, angle) {
  const displacedPoints = [];
  for (const curve of basePath.curves) {
    displacedPoints.push(getPerp(curve, 0, angle, distance));
    displacedPoints.push(getPerp(curve, 0.5, angle, distance));
    displacedPoints.push(getPerp(curve, 1, angle, distance));
  }
  return displacedPoints;
}

function getPerp(curve, time, angle, distance) {
  const point = curve.getPointAtTime(time);
  const tan = curve.getTangentAtTime(time);
  return point.add(tan.rotate(angle).normalize(distance));
}

export const getParralelPath = function (basePath, distance, direction) {
  return new Path({
    segments: getParralelPoints(basePath, distance, direction),
  });
};

export const extrudeFromPath = function (basePath, distance, smooth = true) {
  const begin = basePath.curves[0];
  const end = basePath.curves[basePath.curves.length - 1];
  const points = [
    getPerp(begin, 0, 90, distance).add(
      begin.point1.subtract(begin.point2).normalize(distance)
    ),
    getPerp(begin, 0, -90, distance).add(
      begin.point1.subtract(begin.point2).normalize(distance)
    ),
    ...getParralelPoints(basePath, distance, -90),
    getPerp(end, 1, -90, distance).add(
      end.point2.subtract(end.point1).normalize(distance)
    ),
    getPerp(end, 1, 90, distance).add(
      end.point2.subtract(end.point1).normalize(distance)
    ),
    ...getParralelPoints(basePath, distance, 90).reverse(),
  ];

  const path = new Path({
    segments: points,
    closed: true,
    //selected:true,
  });
  if (smooth) path.smooth();
  //const tmp = path.unite(path);
  //tmp.simplify(1);
  //path.remove();
  return path;
};

export function cutPath(path, cutPath) {
  const intersections = path.getIntersections(cutPath);
  const intersectionsPoints = intersections.map(
    (intersection) => intersection.point
  );
  const intersectionsPath = new Path({
    segments: intersectionsPoints,
  });
  const finalPath = intersectionsPath.split(cutPath);
  intersectionsPath.remove();
  return finalPath;
}

export function generateHatchesPaths(
  path,
  distance,
  length,
  angle,
  hashStyle = "default",
  hatchesIn = "in",
  options = {}
) {
  const d = getPerp(path.curves[0], 0, angle, distance);
  const hi = hatchesIn === "in";
  if ((hi && !path.contains(d)) || (!hi && path.contains(d))) {
    angle *= -1;
  }
  const hatchesPaths = new CompoundPath();
  for (const curve of path.curves) {
    const numSteps = Math.ceil(curve.length / distance);
    hatchesPaths.addChild(
      hatch(curve, path, numSteps, length, angle, hi, hashStyle, options)
    );
  }
  return hatchesPaths;
}

function hatch(
  curve,
  path,
  numSteps,
  length,
  angle,
  hatchesIn = true,
  hashStyle,
  options
) {
  const lengthDistribution = options.lengthDistribution || "default";
  const hatchesPaths = new CompoundPath();
  if (length < 1) {
    return hatchesPaths
  }
  const res = options.res || 4;
  const amp = options.amp || 5;
  const freq = options.freq || 1;
  const ons = options.ns || 1;
  for (let i = 0; i < numSteps; i++) {
    const point = curve.getPointAtTime(i / numSteps);
    const tan = curve.getTangentAtTime(i / numSteps);
    const finalPoints = [point];
    let l = length;
    if (lengthDistribution == "alternate") {
      l = length * (i % 2 === 0 ? 1 : 0.5);
    }
    if (lengthDistribution == "noise") {
      l = length * random(0.3, 1);
    }
    if (lengthDistribution == "sin") {
      l = length * Math.sin((i / numSteps) * Math.PI);
    }
    if (lengthDistribution == "powsin") {
      l = length * Math.pow(Math.sin((i / numSteps) * Math.PI), 3);
    }
    const s = ((Math.PI * 2) / res) * freq;
    for (let j = 0; j < res; j++) {
      let lastPoint = finalPoints[finalPoints.length - 1];
      let additive = tan.rotate(angle).normalize((l / res) * j + 1);
      if (hashStyle === "sin") {
        additive = additive.add(tan.normalize(amp).multiply(Math.sin(s * j)));
      }
      if (hashStyle === "noise") {
        additive = additive.add(
          tan
            .normalize(amp)
            .multiply(noise(lastPoint.x * ons, lastPoint.y * ons))
        );
      }

      const endPoint = point.add(additive);
      if (
        (hatchesIn && path.contains(endPoint)) ||
        (!hatchesIn && !path.contains(endPoint))
      ) {
        finalPoints.push(endPoint);
      } else {
        const p = new Path({
          segments: [lastPoint, endPoint],
        });
        // get the intersection point with the path
        const intersections = path.getIntersections(p);
        if (intersections.length > 0) {
          finalPoints.push(intersections[0].point);
        }
        p.remove();
        break;
      }
    }
    const finalPath = new Path({
      segments: finalPoints,
    });
    hatchesPaths.addChild(finalPath);
  }
  return hatchesPaths;
}

function hashCode(str) {
  var hash = 0,
    i,
    chr,
    len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
export function seed(seedString) {
  simplex = new SimplexNoise(seedString);
  iterOffset = 0;
  seedOffset = hashCode(seedString);
}

export function noise(x, y) {
  return simplex.noise2D(x, y);
}

export function random(min, max) {
  return map(simplex.noise2D(iterOffset++ * ns, seedOffset), -1, 1, min, max);
}

export function map(value, start1, stop1, start2, stop2) {
  let newVal =
    ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
  if (start2 < stop2) {
    newVal = constrain(newVal, start2, stop2);
  } else {
    newVal = constrain(newVal, stop2, start2);
  }
  return newVal;
}

export function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

export const downloadAsSVG = function (name) {
  var url =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(paper.project.exportSVG({ asString: true }));

  var link = document.createElement("a");
  link.download = name;
  link.href = url;
  link.click();
};

export const hatchOptions = [
  { text: "Default", value: "default" },
  { text: "Sin", value: "sin" },
  { text: "Noise", value: "noise" },
];

export const lengthOptions = [
  { text: "Default", value: "default" },
  { text: "Alternate", value: "alternate" },
  { text: "Noise", value: "noise" },
  { text: "Sin", value: "sin" },
  { text: "Power sin", value: "powsin" },
];

export const linePattern = [
  { text: "Default", value: "default" },
  { text: "Dotted", value: "dotted" },
  { text: "Sin", value: "sin" },
];

export const dashedDistribution = [
  { text: "Default", value: "default" },
  { text: "Power In", value: "powerIn" },
  { text: "Power Out", value: "powerOut" },
  { text: "Dashed", value: "dashed" },
];

/**
 * @param Config config
 * {
 *  groups: [
 *   {
 *   name: string,
 *   inputs: [input],
 *   buttons: [button],
 *   expanded : boolean
 *   }
 *  ]
 * }
 *
 *  input:
 *   {
 *    name: string,
 *    type: string, // string, number, boolean, color
 *    label: string,
 *    options: any,
 *    fixed: boolean,
 *   }
 * button:
 *   {
 *    name: string,
 *    onClick: function,
 *   }
 */

export class ConfigProvider {
  constructor(schema, pane) {
    this.pane = pane;
    this.schema = schema;
    this.config = {};
    this.validateSchema();
    this.build();
    // Return a config proxy
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop];
        }
        return target.config[prop];
      },
    });
  }

  generate() {
    for (const group of this.schema.groups) {
      for (const input of group.inputs) {
        if (!!input.fixed) {
          continue;
        }
        if (input.type === "boolean") {
          this.config[input.name] = Math.floor(random(0, 2)) === 1;
        }
        if (input.type === "number") {
          let min = input.options.min || 0;
          let max = input.options.max || 1;
          if (!!input.lt) {
            max = this.config[input.lt] || input.options.default;
          }
          if (!!input.gt) {
            min = this.config[input.gt] || input.options.default;
          }
          this.config[input.name] = Math.floor(random(min, max));
        }
        if (input.type === "float") {
          this.config[input.name] = random(
            input.options.min,
            input.options.max
          );
        }
        if (input.type === "string") {
          if (input.options.options) {
            const n = Math.floor(random(0, input.options.options.length));
            this.config[input.name] = input.options.options[n].value;
          } else {
            this.config[input.name] = Math.random()
              .toString(36)
              .substring(2, 7);
          }
        }
      }
    }
    this.pane.refresh();
  }

  validateSchema() {
    if (!this.schema.groups) {
      throw new Error("groups is required");
    }

    if (this.schema.groups && !Array.isArray(this.schema.groups)) {
      throw new Error("groups must be an array");
    }
  }

  getDefault(type) {
    if (type === "number") {
      return 0;
    }
    if (type === "boolean") {
      return false;
    }
    if (type === "string") {
      return "";
    }
  }

  build() {
    for (const group of this.schema.groups) {
      const g = this.pane.addFolder({
        title: group.name,
        expanded: group.expanded || false,
      });
      if (group.buttons) {
        for (const button of group.buttons) {
          const b = g.addButton({ title: button.name });
          b.on("click", button.onClick);
        }
      }
      if (group.inputs) {
        for (const input of group.inputs) {
          this.config[input.name] =
            input?.options?.default || this.getDefault(input.type);
          g.addInput(this.config, input.name, input.options);
        }
      }
    }
  }
}
