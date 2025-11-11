'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, XCircle } from 'lucide-react';
import { api, Table } from '@/lib/api';

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const response = await api.getTables();
      if (response.success) {
        setTables(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load tables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Users className="w-12 h-12 text-amber-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading tables...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tables</h1>
        <div className="text-sm text-gray-600">
          Total Tables: {tables.length}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table, index) => (
          <motion.div
            key={table.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-xl shadow-sm p-6 border-2 ${
              table.isActive ? 'border-green-200' : 'border-red-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  table.isActive ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Users className={`w-6 h-6 ${
                    table.isActive ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Table {table.number}</h3>
                  <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                table.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {table.isActive ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Available</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Unavailable</span>
                  </>
                )}
              </div>
              <span className="text-xs text-gray-500">
                Updated: {new Date(table.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No tables found</p>
          <p className="text-gray-500">Tables will appear here when added to the system.</p>
        </div>
      )}
    </div>
  );
}