// CHART START

// Definicion de constantes
const width = 800
const height = 500
const margin = {top: 10,    
    bottom: 40,    
    left: 10,     
    right: 20
}

// Declaracion del svg
const svg = d3.select("#chart")
.append("svg")
.attr("id", "svg")
.attr("width", width)
.attr("height", height)


const elementGroup = svg.append("g")
.attr("id", "elementGroup")
.attr('transform', `translate(${0}, ${margin.top})`)


// Declaracion de las escalas:
const y = d3.scaleBand()
    .range([0 , height - margin.top - margin.bottom])
    .paddingInner(0.2).paddingOuter(0.04)
const x = d3.scaleLinear()
    .range([0, width - margin.left - margin.right])

// Declaracion de los ejes
const axisGroup = svg.append("g").attr("id", "axisGroup")
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup").attr('transform', `translate(${margin.left},${height - margin.bottom})`)
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup").attr('transform', `translate(${margin.left},${margin.top})`)

const dateFormat = d3.timeParse("%Y")

const xAxis = d3.axisBottom()
    .scale(x).ticks(5).tickSize(-height)
const yAxis = d3.axisLeft()
    .scale(y).ticks(9).tickSize(-width)



// Formato de datos
d3.csv("data.csv").then(data => {
    data = d3.nest()
        .key(d => d.winner)
        .entries(data)
    
    data.map(d => {
        d.title = d.values.length
        d.winner = d.key
        d.year = + d.year
    })

    // Añadir el dominio a la escala 
    y.domain(data.map(d=> d.key))
    x.domain(d3.extent(data.map(d=> d.title)))

    // Llamar a los ejes
    xAxisGroup.call(xAxis)
    yAxisGroup.call(yAxis)

    //Data binding
    let bars = elementGroup.selectAll("rect").data(data)
    
    // Patron actualizacion
    bars.enter().append('rect')
        .attr('class', "bar")
        .attr('height', y.bandwidth())
        .attr('width',d=> width - x(d.values.length) - margin.left - margin.right )
        .attr('x', d => x(d.values.length))
        .attr('y', d => y(d.key))
})