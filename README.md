## View live demo [here](http://bobirakova.com/indicators-sunburst/)

The visualizations in this project are inspired by the [Ode to the Sunburst](https://denjn5.github.io/sunburst-0/) project developed by David Richards.

A Sunburst is a data visualization technique which is useful when working with hierarchical data. This tutorial will show you how to use the code base to create interactive Sunburst visualizations given an Excel sheet. The sheet you provide needs to be in csv format. You can see the csv that was used for the [demo](http://bobirakova.com/indicators-sunburst/) in the `data/` directory together with a csv which we'll use for building a simple example.

Let's say that you're curious about Sunlight.
> Sunlight is a portion of the electromagnetic radiation given off by the Sun, in particular infrared, visible, and ultraviolet light. (Source: [Wikipedia](https://en.wikipedia.org/wiki/Sunlight))

You go on to read about [electromagnetic radiation](https://imagine.gsfc.nasa.gov/science/toolbox/emspectrum1.html) and decide to use a sunburst diagram to visualize part of the Electromagnetic Spectrum. First, you need to create the Excel csv file. For this example, we'll use the `data/sunburst_em.csv`:

Type of EM | Where you encounter it | Wavelength
------------ | ------------- | -------------
Gamma-ray | Terrestrial gamma-ray flashes |
X-ray | PET scan |  
X-ray | Airport security scanner |
Solar spectrum | Ultraviolet | C: 100 nm - 280 nm
Solar spectrum | Ultraviolet | B: 280 nm - 315 nm
Solar spectrum | Ultraviolet | A: 315 nm - 400 nm
Solar spectrum | Visible |
Solar spectrum | Infrared | A: 700 nm - 1,400 nm
Solar spectrum | Infrared | B: 1,400 nm - 3,000 nm
Solar spectrum | Infrared | C: 3,000 nm - 1 mm
Microwave | Microwave oven |
Radio | Aircraft comm |
Radio | Amateur radio |
Radio | AM radio |

For now you provide wavelength data only for the Solar Spectrum(Sunlight) category.

# Code
By looking at the `index.html`, you can see that it loads a javascript file which has the [d3](https://d3js.org/) code for the sunburst visualization: `<script type="text/javascript" src="demo_sunburst.js"></script>`

## D3
You might want to change the dimensions of your sunburst diagram depending on your data. These are defined at the very top of the `demo_sunburst.js` script. You could also decide wether or not you want to provide labels for the cells of the sunburst. This repository contains two examples, one with labels(`demo_sunburst.js`) and one without them(`interactive_sunburst.js`). For this example we'll add labels and we'll specify that we want to crop the text, so that it appears on multiple lines instead of a single line. You might need to adjust the maximum length of the cropped text by using the `function wrap(text, width)` function call and providing the desired width. For the demo, we've specified the width as follows:

```javascript
  var text = g.append("text")
      .attr("x", function(d) { return y(d.y); })
      .attr("y", 0)
      .text(function(d) { return d.name; })
      .call(wrap, 70);
```

That's all you need to do:
![A Sunburst of the Electromagnetic Spectrum](/img/sunburst_em.png)

When visualizing large amounts of data, it is much easier if you omit the labels. In that case, you could show the label only when the user interacts with the plot and hovers over a specific cell in the sunburst. You can do that by using the `interactive_sunburst.js` code template. You might need to adjust its size depending on the size of the data you provide. In the screenshot below the provided raw csv file contained 131 rows and the user has selected a specific one. They are then able to see the details for the selected raw in the center of the sunburst:
![A Sunburst with details in the center](/img/interactive.png)

## Thank You!
