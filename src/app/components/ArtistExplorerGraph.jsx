'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ArtistExplorerGraph = ({ nodes, links}) => {
  const graphRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(graphRef.current);
    svg.selectAll('*').remove(); // Clear previous graph (if any)
    const storedArtists = JSON.parse(localStorage.getItem('topArtists') || '[]');

    if (storedArtists.length > 0) {
      // Create a 'g' element for zooming and panning
      const g = svg.append('g');

      // Create a zoom behavior
      const zoom = d3.zoom().on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

      // Apply the zoom behavior on the svg
      svg.call(zoom);

      const width = +svg.attr('width');
      const height = +svg.attr('height');

      const nodes = storedArtists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        value: artist.popularity,
      }));

      const generateRandomWeights = (nodes) => {
        const weights = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const weight = Math.floor(Math.random() * 10) + 1;
            weights.push({ source: nodes[i].id, target: nodes[j].id, weight });
          }
        }
        return weights;
      };

      const links = generateRandomWeights(nodes);

      const simulation = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d) => d.id))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2)) // center the graph
        .force('boundary', boundaryForce(width, height)) // keep nodes within the SVG area
        .force('collision', d3.forceCollide().radius((d) => d.value));

      const drag = (simulation) => {
        function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        }

        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }

        return d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended);
      };

      const link = g
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', 'rgba(120, 70, 200, 0.5)')
        .attr('stroke-width', (d) => d.weight);

      const node = g
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', (d) => d.value)
        .attr('fill', (d) => d3.interpolateBlues(d.value / 100))
        .call(drag(simulation)); // Apply drag behavior

        const label = svg.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.name)
            .attr("text-anchor", "middle")
            .attr("fill", "#333")
            .attr("stroke", "#fff")
            .attr("stroke-width", 0.5)
            .attr("font-size", "10px")
            .attr("dy", -7);

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);

        label
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      });
    }
  }, [nodes, links]);

  return (
    <div>
      <svg ref={graphRef} width="800" height="600" />
    </div>
  );
};


// This is the boundary force that keeps the nodes within the SVG area
function boundaryForce(width, height) {
  const radius = 50; // This is the radius of the nodes
  return (alpha) => {
    return (d) => {
      d.x = Math.max(radius, Math.min(width - radius, d.x));
      d.y = Math.max(radius, Math.min(height - radius, d.y));
    };
  };
}


export default ArtistExplorerGraph;
