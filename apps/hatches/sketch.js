import {
  generateHatchesPaths,
  downloadAsSVG,
  lengthOptions,
  hatchOptions,
  ConfigProvider,
  seed,
  random,
} from "./utils.js";

let config;
const generalGroup = {
  name: "General",
  buttons: [
    {
      name: "Download",
      onClick: () => downloadAsSVG(config.seed),
    },
    {
      name: "Generate",
      onClick: generate,
    },
    {
      name: "Compute",
      onClick: compute,
    },
  ],
  inputs: [
    {
      name: "seed",
      type: "string",
      options: {
        label: "Seed",
        default: "lol",
      },
    },
  ],
  expanded: true,
};

const schema = {
  groups: [
    generalGroup,
    {
      name: "Inner Shape",
      inputs: [
        {
          name: "lengthIn",
          type: "number",
          options: {
            label: "Length",
            default: 10,
            min: 0,
            max: 200,
            step: 1,
          },
        },
        {
          name: "intervalIn",
          type: "number",
          options: {
            label: "Interval",
            default: 3,
            min: 1,
            max: 30,
            step: 1,
          },
        },
        {
          name: "sidesIn",
          type: "number",
          options: {
            label: "Sides",
            default: 3,
            min: 3,
            max: 10,
            step: 1,
          },
        },
        {
          name: "radiusIn",
          type: "number",
          options: {
            label: "Radius",
            default: 80,
            min: 20,
            max: 190,
            step: 1,
          },
          lt: "radiusOut",
        },
        {
          name: "resIn",
          type: "number",
          options: {
            label: "Resolution",
            default: 3,
            min: 3,
            max: 100,
            step: 1,
          },
        },
        {
          name: "freqIn",
          type: "float",
          options: {
            label: "Frequency",
            default: 2,
            min: 0,
            max: 6,
            step: 0.1,
          },
        },
        {
          name: "ampIn",
          type: "float",
          options: {
            label: "Amplitude",
            default: 3,
            min: 0,
            max: 10,
            step: 0.1,
          },
        },
        {
          name: "lengthDistributionIn",
          type: "string",
          options: {
            label: "Length Distribution",
            default: "noise",
            options: lengthOptions,
          },
        },
        {
          name: "hatchStyleIn",
          type: "string",
          options: {
            label: "Hatch Style",
            default: "noise",
            options: hatchOptions,
          },
        },
        {
          name: "nsIn",
          type: "float",
          options: {
            label: "Noise Scale",
            default: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        {
          name: "smoothIn",
          type: "boolean",
          options: {
            label: "Smooth",
          },
        },
        {
          name: "displayIn",
          type: "boolean",
          options: {
            label: "Display",
          },
        },
      ],
    },
    {
      name: "Outer Shape",
      inputs: [
        {
          name: "lengthOut",
          type: "number",
          options: {
            label: "Length",
            default: 100,
            min: 0,
            max: 200,
            step: 1,
          },
        },
        {
          name: "intervalOut",
          type: "number",
          options: {
            label: "Interval",
            default: 3,
            min: 1,
            max: 30,
            step: 1,
          },
        },
        {
          name: "sidesOut",
          type: "number",
          options: {
            label: "Sides",
            default: 3,
            min: 3,
            max: 10,
            step: 1,
          },
        },
        {
          name: "radiusOut",
          type: "number",
          options: {
            label: "Radius",
            default: 150,
            min: 70,
            max: 200,
            step: 1,
          },
          gt: "radiusIn",
        },
        {
          name: "resOut",
          type: "number",
          options: {
            label: "Resolution",
            default: 20,
            min: 3,
            max: 100,
            step: 1,
          },
        },
        {
          name: "freqOut",
          type: "float",
          options: {
            label: "Frequency",
            default: 0.5,
            min: 0,
            max: 6,
            step: 0.1,
          },
        },
        {
          name: "ampOut",
          type: "float",
          options: {
            label: "Amplitude",
            default: 3,
            min: 0,
            max: 10,
            step: 0.1,
          },
        },
        {
          name: "lengthDistributionOut",
          type: "string",
          options: {
            label: "Length Distribution",
            default: "noise",
            options: lengthOptions,
          },
        },
        {
          name: "hatchStyleOut",
          type: "string",
          options: {
            label: "Hatch Style",
            default: "noise",
            options: hatchOptions,
          },
        },
        {
          name: "nsOut",
          type: "float",
          options: {
            label: "Noise Scale",
            default: 0.1,
            min: 0,
            max: 1,
            step: 0.01,
          },
        },
        {
          name: "smoothOut",
          type: "boolean",
          options: {
            label: "Smooth",
          },
        },
        {
          name: "displayOut",
          type: "boolean",
          options: {
            label: "Display",
          },
        },
      ],
    },
  ],
};

export default function (pane) {
  config = new ConfigProvider(schema, pane);
  generate();
}

function generate() {
  seed(config.seed);
  config.generate();
  compute();
}

function compute() {
  seed(config.seed);
  paper.project.clear();
  const group = new Group();

  const triangle = new Path.RegularPolygon({
    center: [200, 200],
    sides: config.sidesOut,
    radius: config.radiusOut,
  });
  group.addChild(triangle);
  if (config.smoothOut) {
    triangle.smooth({ type: "geometric", factor: random(0, 1) });
  }
  if (config.displayOut) {
    triangle.strokeColor = "black";
    triangle.strokeWidth = 1;
  }
  const innerTriangle = new Path.RegularPolygon({
    center: [200, 200],
    sides: config.sidesIn,
    radius: config.radiusIn,
  });
  group.addChild(innerTriangle);
  if (config.smoothIn) {
    innerTriangle.smooth({ type: "geometric", factor: random(0, 1) });
  }
  if (config.displayIn) {
    innerTriangle.strokeColor = "black";
    innerTriangle.strokeWidth = 1;
  }

  const diff = triangle.subtract(innerTriangle);

  const hatches = generateHatchesPaths(
    diff,
    config.intervalOut,
    config.lengthOut,
    -90,
    config.hatchStyleOut,
    "out",
    {
      res: config.resOut,
      freq: config.freqOut,
      amp: config.ampOut,
      lengthDistribution: config.lengthDistributionOut,
      ns: config.nsOut,
    }
  );
  hatches.strokeColor = "black";
  hatches.strokeWidth = 1;
  group.addChild(hatches);
  diff.remove();

  const hatches2 = generateHatchesPaths(
    diff,
    config.intervalIn,
    config.lengthIn,
    -90,
    config.hatchStyleIn,
    "in",
    {
      res: config.resIn,
      freq: config.freqIn,
      amp: config.ampIn,
      lengthDistribution: config.lengthDistributionIn,
      ns: config.nsIn,
    }
  );
  hatches2.strokeColor = "black";
  hatches2.strokeWidth = 1;
  group.addChild(hatches2);
  group.position = view.center;
}
