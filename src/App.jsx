import { useState } from 'react';
import { motion } from 'motion/react';
import { useTraderSimulation } from './data/simulation';
import AmbientBackground from './components/AmbientBackground';
import Header from './components/Header';
import SystemMetrics from './components/SystemMetrics';
import TraderCard from './components/TraderCard';
import PortfolioModal from './components/PortfolioModal';

export default function App() {
  const traders = useTraderSimulation();
  const [selectedTrader, setSelectedTrader] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPortfolio = (trader) => {
    setSelectedTrader(trader);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTrader(null), 300);
  };

  return (
    <div className="min-h-screen relative font-sans">
      <AmbientBackground />

      {/* Main content */}
      <div className="relative z-10 pb-8">
        <Header traders={traders} />
        <SystemMetrics traders={traders} />

        {/* Trader Cards Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mx-4 mt-4"
        >
          {traders.map((trader, index) => (
            <TraderCard
              key={trader.id}
              trader={trader}
              index={index}
              onViewPortfolio={handleViewPortfolio}
            />
          ))}
        </motion.div>
      </div>

      {/* Portfolio Modal */}
      <PortfolioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        trader={selectedTrader}
      />
    </div>
  );
}
