async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 600,
        margin: {
            top: 20,
            left: 10,
            bottom: 20,
            right: 30
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("fill","none")
        .attr("stroke", "yellow")
        
    const yAccessor_high = (d) => d.temperatureHigh;

    const yScaler_high = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor_high))
        .range([dimension.boundedHeight, 0]);

    var lineGenerator_high = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler_high(yAccessor_high(d)));

    bounded.append("path")
        .attr("d", lineGenerator_high(data))
        .attr("fill","none")
        .attr("stroke", "blue")
        
        
    const Ax_x = d3.axisBottom(xScaler);
    const Ax_y = d3.axisRight(yScaler);
    
    bounded.append("g")
      .attr("transform", `translate(0, ${dimension.boundedHeight})`)
      .call(Ax_x);
    bounded.append("g")
      .attr("transform", `translate(0, 0)`)
      .call(Ax_y)
     
}

buildPlot();
