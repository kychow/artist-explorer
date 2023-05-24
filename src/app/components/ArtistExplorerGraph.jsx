'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ArtistExplorerGraph = ({ topArtists }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(graphRef.current);
    svg.selectAll('*').remove(); // Clear previous graph (if any)
    const storedArtists = JSON.parse(localStorage.getItem('topArtists') || '[]');

    if (storedArtists.length > 0) {
      const nodes = topArtists.map((artist) => ({
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
      console.log(nodes);
      console.log(links);

      const simulation = d3
        .forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d) => d.id))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(svg.node().parentElement.clientWidth / 2, svg.node().parentElement.clientHeight / 2))
        .force('collision', d3.forceCollide().radius((d) => d.value * 30));

      const link = svg
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', 'rgba(50, 50, 50, 0.2)')
        .attr('stroke-width', (d) => Math.sqrt(d.weight));

      const node = svg
        .selectAll('circle')
        .data(nodes)
        .enter()
        .append('circle')
        .attr('r', (d) => d.value * 10)
        .attr('fill', (d) => d3.interpolateBlues(d.value));

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);

        node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
      });
    }
  }, [topArtists]);

  return (
    <div>
      <svg ref={graphRef} width="800" height="600" />
    </div>
  );
};

export default ArtistExplorerGraph;
