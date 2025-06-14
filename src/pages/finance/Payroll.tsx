
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Edit, DollarSign, Calculator, Users } from "lucide-react";
import { toast } from "sonner";

interface PayrollEntry {
  id: string;
  employee_id: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  gross_salary: number;
  net_salary: number;
  currency: string;
  pay_period: string;
  status: string;
}

interface Profile {
  id: string;
  full_name: string;
  employee_id: string;
  job_title: string;
  department: string;
}

const Payroll = () => {
  const [payrollData, setPayrollData] = useState<PayrollEntry[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEntry, setEditingEntry] = useState<PayrollEntry | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchPayrollData();
    fetchProfiles();
  }, []);

  const fetchPayrollData = async () => {
    try {
      const { data, error } = await supabase
        .from('payroll')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayrollData(data || []);
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, employee_id, job_title, department')
        .not('employee_id', 'is', null);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleSavePayroll = async (entry: Partial<PayrollEntry>) => {
    try {
      if (editingEntry) {
        const { error } = await supabase
          .from('payroll')
          .update(entry)
          .eq('id', editingEntry.id);

        if (error) throw error;
        toast.success('Payroll updated successfully');
      } else {
        const { error } = await supabase
          .from('payroll')
          .insert([entry]);

        if (error) throw error;
        toast.success('Payroll entry created successfully');
      }

      fetchPayrollData();
      setEditingEntry(null);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error saving payroll:', error);
      toast.error('Failed to save payroll entry');
    }
  };

  const totalPayroll = payrollData.reduce((sum, entry) => sum + entry.net_salary, 0);
  const avgSalary = payrollData.length > 0 ? totalPayroll / payrollData.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6 flex items-center justify-center">
        <div className="text-white">Loading payroll data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Payroll Management</h1>
              <p className="text-white/70">Manage employee salaries and compensation</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => toast.info('Export feature coming soon')}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 text-white border-white/20">
                  <DialogHeader>
                    <DialogTitle>Add Payroll Entry</DialogTitle>
                  </DialogHeader>
                  <PayrollForm onSave={handleSavePayroll} profiles={profiles} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Payroll</p>
                    <p className="text-2xl font-bold text-white">${totalPayroll.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Average Salary</p>
                    <p className="text-2xl font-bold text-white">${avgSalary.toLocaleString()}</p>
                  </div>
                  <Calculator className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Employees</p>
                    <p className="text-2xl font-bold text-white">{payrollData.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payroll Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Employee Payroll</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white">Employee ID</TableHead>
                    <TableHead className="text-white">Base Salary</TableHead>
                    <TableHead className="text-white">Bonus</TableHead>
                    <TableHead className="text-white">Deductions</TableHead>
                    <TableHead className="text-white">Net Salary</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollData.map((entry) => (
                    <TableRow key={entry.id} className="border-white/20">
                      <TableCell className="text-white">{entry.employee_id}</TableCell>
                      <TableCell className="text-white">${entry.base_salary.toLocaleString()}</TableCell>
                      <TableCell className="text-white">${entry.bonus.toLocaleString()}</TableCell>
                      <TableCell className="text-white">${entry.deductions.toLocaleString()}</TableCell>
                      <TableCell className="text-white font-medium">${entry.net_salary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={entry.status === 'active' ? 'default' : 'secondary'}
                          className={entry.status === 'active' ? 'bg-green-500' : ''}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEntry(entry)}
                          className="text-white hover:bg-white/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Dialog */}
        {editingEntry && (
          <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
            <DialogContent className="bg-gray-900 text-white border-white/20">
              <DialogHeader>
                <DialogTitle>Edit Payroll Entry</DialogTitle>
              </DialogHeader>
              <PayrollForm 
                entry={editingEntry} 
                onSave={handleSavePayroll} 
                profiles={profiles}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const PayrollForm = ({ entry, onSave, profiles }: { 
  entry?: PayrollEntry | null; 
  onSave: (entry: Partial<PayrollEntry>) => void;
  profiles: Profile[];
}) => {
  const [formData, setFormData] = useState({
    employee_id: entry?.employee_id || '',
    base_salary: entry?.base_salary || 0,
    bonus: entry?.bonus || 0,
    deductions: entry?.deductions || 0,
    currency: entry?.currency || 'USD',
    pay_period: entry?.pay_period || 'monthly',
    status: entry?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Employee ID</label>
        <Input
          value={formData.employee_id}
          onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
          className="bg-white/10 border-white/20 text-white"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Base Salary</label>
          <Input
            type="number"
            value={formData.base_salary}
            onChange={(e) => setFormData({ ...formData, base_salary: parseFloat(e.target.value) })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Bonus</label>
          <Input
            type="number"
            value={formData.bonus}
            onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-2">Deductions</label>
        <Input
          type="number"
          value={formData.deductions}
          onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })}
          className="bg-white/10 border-white/20 text-white"
        />
      </div>
      <Button type="submit" className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
        {entry ? 'Update' : 'Create'} Payroll Entry
      </Button>
    </form>
  );
};

export default Payroll;
