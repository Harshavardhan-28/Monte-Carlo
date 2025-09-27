import { useState, useEffect, useRef } from "react";

interface Node {
  id: string;
  state: 'Bull' | 'Bear' | 'Neutral';
  x: number;
  y: number;
  level: number;
  visible: boolean;
}

interface Edge {
  from: string;
  to: string;
  probability: number;
  visible: boolean;
}

const MarkovChain = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [matrixVisible, setMatrixVisible] = useState(false);
  const [matrixValues, setMatrixValues] = useState<number[][]>([
    [0, 0, 0],
    [0, 0, 0], 
    [0, 0, 0]
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const matrixRef = useRef<HTMLDivElement>(null);

  const stateTransitions = {
    Bull: [
      { to: 'Bull', probability: 0.75 },
      { to: 'Bear', probability: 0.15 },
      { to: 'Neutral', probability: 0.1 }
    ],
    Bear: [
      { to: 'Bear', probability: 0.6 },
      { to: 'Bull', probability: 0.25 },
      { to: 'Neutral', probability: 0.15 }
    ],
    Neutral: [
      { to: 'Neutral', probability: 0.4 },
      { to: 'Bull', probability: 0.4 },
      { to: 'Bear', probability: 0.2 }
    ]
  };

  // Final transition matrix values
  const finalMatrix = [
    [0.75, 0.15, 0.10], // Bull -> Bull, Bear, Neutral
    [0.25, 0.60, 0.15], // Bear -> Bull, Bear, Neutral  
    [0.40, 0.20, 0.40]  // Neutral -> Bull, Bear, Neutral
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const matrixObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !matrixVisible) {
          setMatrixVisible(true);
          setTimeout(() => {
            startMatrixAnimation();
          }, 1000); // Start matrix animation 1 second after it becomes visible
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    if (matrixRef.current) {
      matrixObserver.observe(matrixRef.current);
    }

    return () => {
      observer.disconnect();
      matrixObserver.disconnect();
    };
  }, [matrixVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const createNodes = () => {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];

      // Level 0: Starting Bull node (root)
      newNodes.push({
        id: 'bull-0',
        state: 'Bull',
        x: 500,
        y: 100,
        level: 0,
        visible: false
      });

      // Level 1: Three states from Bull
      const level1States: ('Bull' | 'Bear' | 'Neutral')[] = ['Bull', 'Bear', 'Neutral'];
      level1States.forEach((state, index) => {
        const xPos = 250 + (index * 250); // 200, 400, 600 - wider spacing
        newNodes.push({
          id: `${state.toLowerCase()}-1-${index}`,
          state,
          x: xPos,
          y: 250,
          level: 1,
          visible: false
        });

        newEdges.push({
          from: 'bull-0',
          to: `${state.toLowerCase()}-1-${index}`,
          probability: stateTransitions.Bull[index].probability,
          visible: false
        });
      });

      // Level 2: Three states from each level 1 node
      level1States.forEach((parentState, parentIndex) => {
        const parentX = 250 + (parentIndex * 250); // Match level 1 positions
        stateTransitions[parentState].forEach((transition, transIndex) => {
          const nodeId = `${transition.to.toLowerCase()}-2-${parentIndex}-${transIndex}`;
          const xOffset = (transIndex - 1) * 80; // Increased spacing to prevent overlap
          newNodes.push({
            id: nodeId,
            state: transition.to as 'Bull' | 'Bear' | 'Neutral',
            x: parentX + xOffset,
            y: 400,
            level: 2,
            visible: false
          });

          newEdges.push({
            from: `${parentState.toLowerCase()}-1-${parentIndex}`,
            to: nodeId,
            probability: transition.probability,
            visible: false
          });
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);
    };

    createNodes();

    // Animate nodes appearing
    const animateNodes = async () => {
      // Show level 0
      setTimeout(() => {
        setNodes(prev => prev.map(node => 
          node.level === 0 ? { ...node, visible: true } : node
        ));
      }, 500);

      // Show level 1
      setTimeout(() => {
        setNodes(prev => prev.map(node => 
          node.level === 1 ? { ...node, visible: true } : node
        ));
        setEdges(prev => prev.map(edge => {
          if (edge.from === 'bull-0') {
            return { ...edge, visible: true };
          }
          return edge;
        }));
      }, 1500);

      // Show level 2
      setTimeout(() => {
        setNodes(prev => prev.map(node => 
          node.level === 2 ? { ...node, visible: true } : node
        ));
        setEdges(prev => prev.map(edge => {
          if (edge.from !== 'bull-0') {
            return { ...edge, visible: true };
          }
          return edge;
        }));
      }, 2500);
    };

    animateNodes();
  }, [isVisible]);

  const startMatrixAnimation = () => {
    setIsSpinning(true);
    
    // Create spinning effect with random values
    const spinInterval = setInterval(() => {
      setMatrixValues(prev => prev.map(row => 
        row.map(() => parseFloat(Math.random().toFixed(2)))
      ));
    }, 100);

    // Stop spinning and set final values
    setTimeout(() => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      setMatrixValues(finalMatrix);
    }, 3000);
  };

  return (
    <section ref={containerRef} className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Markov Chain <span className="text-blue-400">Intelligence</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Our AI agents use advanced Markov Chain models to predict market states and optimize trading strategies. 
            Watch how each state probabilistically transitions to the next, creating intelligent decision trees.
          </p>
        </div>

        {/* Markov Chain Visualization */}
        <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12">
          <div className="relative w-full h-[500px] overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1000 500">
              {/* Lines with probabilities */}
              {edges.map((edge, index) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                
                if (!fromNode || !toNode || !edge.visible) return null;
                
                const midX = (fromNode.x + toNode.x) / 2;
                const midY = (fromNode.y + toNode.y) / 2;
                
                return (
                  <g key={`edge-${index}`}>
                    {/* Connection line */}
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y + 25}
                      x2={toNode.x}
                      y2={toNode.y - 25}
                      stroke="#60a5fa"
                      strokeWidth="3"
                      opacity={edge.visible ? 1 : 0}
                    />
                    
                    {/* Arrow */}
                    <polygon
                      points={`${toNode.x - 10},${toNode.y - 15} ${toNode.x + 5},${toNode.y - 25} ${toNode.x - 10},${toNode.y - 35}`}
                      fill="#60a5fa"
                      opacity={edge.visible ? 1 : 0}
                    />
                    
                    {/* Probability label */}
                    <rect
                      x={midX - 25}
                      y={midY - 12}
                      width="50"
                      height="24"
                      fill="#1f2937"
                      stroke="#60a5fa"
                      strokeWidth="2"
                      rx="4"
                      opacity={edge.visible ? 1 : 0}
                    />
                    
                    {/* Probability text */}
                    <text
                      x={midX}
                      y={midY + 5}
                      fill="#60a5fa"
                      fontSize="16"
                      textAnchor="middle"
                      className="font-mono font-bold"
                      opacity={edge.visible ? 1 : 0}
                    >
                      {edge.probability}
                    </text>
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <g key={node.id}>
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    fill={
                      node.state === 'Bull' ? '#3b82f6' :
                      node.state === 'Bear' ? '#8b5cf6' : '#6b7280'
                    }
                    stroke={
                      node.state === 'Bull' ? '#60a5fa' :
                      node.state === 'Bear' ? '#a78bfa' : '#9ca3af'
                    }
                    strokeWidth="3"
                    opacity={node.visible ? 1 : 0}
                    style={{
                      transition: 'opacity 1s ease-in-out',
                      filter: 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.5))'
                    }}
                  />
                  
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y - 35}
                    fill="white"
                    fontSize="18"
                    textAnchor="middle"
                    className="font-bold"
                    opacity={node.visible ? 1 : 0}
                    style={{ transition: 'opacity 1s ease-in-out' }}
                  >
                    {node.state}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-8 mt-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border border-blue-400"></div>
              <span className="text-sm text-gray-300">Bull Market</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full border border-purple-400"></div>
              <span className="text-sm text-gray-300">Bear Market</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded-full border border-gray-400"></div>
              <span className="text-sm text-gray-300">Neutral Market</span>
            </div>
          </div>
        </div>

        {/* 3x3 Transition Matrix */}
        <div ref={matrixRef} className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">
              Transition <span className="text-blue-400">Matrix</span>
            </h3>
            <p className="text-gray-400">Live probability matrix showing state transitions</p>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-4 gap-3 items-center">
              {/* Top-left corner: From/To label */}
              <div className="w-20 h-16  rounded-lg  flex items-center justify-center">
                <span className="text-white font-bold text-xs">From/To</span>
              </div>

              {/* Column Headers: Bull, Bear, Neutral */}
              {[0, 1, 2].map(col => (
                <div key={`col-${col}`} className={`w-20 h-16 rounded-lg flex items-center justify-center ${
                  col === 0 ? 'bg-blue-500' : col === 1 ? 'bg-purple-500' : 'bg-gray-500'
                }`}>
                  <span className="text-white font-bold text-sm">
                    {col === 0 ? 'Bull' : col === 1 ? 'Bear' : 'Neutral'}
                  </span>
                </div>
              ))}

              {/* Matrix Rows */}
              {[0, 1, 2].map(row => (
                <>
                  {/* Row Header */}
                  <div key={`row-${row}`} className={`w-20 h-16 rounded-lg flex items-center justify-center ${
                    row === 0 ? 'bg-blue-500' : row === 1 ? 'bg-purple-500' : 'bg-gray-500'
                  }`}>
                    <span className="text-white font-bold text-sm">
                      {row === 0 ? 'Bull' : row === 1 ? 'Bear' : 'Neutral'}
                    </span>
                  </div>
                  
                  {/* Matrix Values for this row */}
                  {[0, 1, 2].map(col => (
                    <div
                      key={`${row}-${col}`}
                      className={`w-20 h-16 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        isSpinning 
                          ? 'border-yellow-400 bg-yellow-400/20 animate-pulse' 
                          : 'border-blue-400 bg-blue-400/20'
                      }`}
                    >
                      <span 
                        className={`font-mono font-bold text-lg transition-all duration-200 ${
                          isSpinning 
                            ? 'text-yellow-400 animate-bounce' 
                            : 'text-blue-400'
                        }`}
                        style={{
                          transform: isSpinning ? 'translateY(-2px)' : 'translateY(0)',
                          animation: isSpinning ? 'spin-numbers 0.1s linear infinite' : 'none'
                        }}
                      >
                        {matrixValues[row][col].toFixed(2)}
                      </span>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>

          {/* Matrix Explanation */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Bull probability</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Bear probability</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>Neutral probability</span>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes spin-numbers {
            0% { transform: translateY(0px) rotateX(0deg); }
            50% { transform: translateY(-3px) rotateX(180deg); }
            100% { transform: translateY(0px) rotateX(360deg); }
          }
        `}</style>

        {/* Key Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="finance-card text-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Probabilistic States</h3>
            <p className="text-gray-400">Each market state transitions with calculated probabilities based on historical data and real-time analysis.</p>
          </div>

          <div className="finance-card text-center">
            <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Dynamic Adaptation</h3>
            <p className="text-gray-400">Our models continuously learn and adapt transition probabilities based on market conditions.</p>
          </div>

          <div className="finance-card text-center">
            <div className="w-16 h-16 bg-gray-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Risk Optimization</h3>
            <p className="text-gray-400">Multi-step lookahead strategies minimize risk while maximizing expected returns across all states.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarkovChain;
