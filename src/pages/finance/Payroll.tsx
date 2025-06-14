
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, DollarSign, Calculator, PieChart } from "lucide-react";
import { toast } from "sonner";

interface PayrollRecord {
  id: string;
  user_id: string;
  employee_id: string;
  base_salary: number;
  bonus: number;
  deductions: number;
  gross_salary: number;
  net_salary: number;
  currency: string;
  pay_period: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  employee_id: string;
  job_title: string;
  department: string;
}

const Payroll = () => {
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch payroll records using type assertion
      const { data: payrollData, error: payrollError } = await supabase
        .from('payroll' as any)
        .select('*')
        .order('created_at', { ascending: false }) as { data: PayrollRecord[] | null, error: any };

      // Fetch profiles for employee information
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, employee_id, job_title, department');

      if (payrollError) throw payrollError;
      if (profilesError) throw profilesError;

      setPayrollRecords(payrollData || []);
      setProfiles(profilesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecord = async (record: Partial<PayrollRecord>) => {
    try {
      if (editingRecord) {
        const { error } = await supabase
          .from('payroll' as any)
          .update(record)
          .eq('id', editingRecord.id);

        if (error) throw error;
        toast.success('Payroll record updated successfully');
      } else {
        const { error } = await supabase
          .from('payroll' as any)
          .insert([record]);

        if (error) throw error;
        toast.success('Payroll record created successfully');
      }

      fetchData();
      setEditingRecord(null);
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error saving payroll record:', error);
      toast.error('Failed to save payroll record');
    }
  };

  const getEmployeeName = (userId: string) => {
    const profile = profiles.find(p => p.id === userId);
    return profile?.full_name || 'Unknown Employee';
  };

  const getEmployeeInfo = (userId: string) => {
    return profiles.find(p => p.id === userId);
  };

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.net_salary, 0);
  const averageSalary = payrollRecords.length > 0 ? totalPayroll / payrollRecords.length : 0;
  const totalEmployees = payrollRecords.length;

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
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payroll Record
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-white/20 max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Payroll Record</DialogTitle>
                </DialogHeader>
                <PayrollForm profiles={profiles} onSave={handleSaveRecord} />
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total Employees</p>
                    <p className="text-2xl font-bold text-white">{totalEmployees}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400" />
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
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Average Salary</p>
                    <p className="text-2xl font-bold text-white">${averageSalary.toLocaleString()}</p>
                  </div>
                  <Calculator className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Active Records</p>
                    <p className="text-2xl font-bold text-white">{payrollRecords.filter(r => r.status === 'active').length}</p>
                  </div>
                  <PieChart className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payroll Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Payroll Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white">Employee</TableHead>
                    <TableHead className="text-white">Employee ID</TableHead>
                    <TableHead className="text-white">Department</TableHead>
                    <TableHead className="text-white">Base Salary</TableHead>
                    <TableHead className="text-white">Bonus</TableHead>
                    <TableHead className="text-white">Deductions</TableHead>
                    <TableHead className="text-white">Net Salary</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((record) => {
                    const employee = getEmployeeInfo(record.user_id);
                    return (
                      <TableRow key={record.id} className="border-white/20">
                        <TableCell className="text-white font-medium">
                          {employee?.full_name || 'Unknown'}
                        </TableCell>
                        <TableCell className="text-white">{record.employee_id}</TableCell>
                        <TableCell className="text-white">{employee?.department || 'N/A'}</TableCell>
                        <TableCell className="text-white">${record.base_salary.toLocaleString()}</TableCell>
                        <TableCell className="text-white">${record.bonus.toLocaleString()}</TableCell>
                        <TableCell className="text-white">${record.deductions.toLocaleString()}</TableCell>
                        <TableCell className="text-white font-bold">${record.net_salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            record.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                          }`}>
                            {record.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingRecord(record)}
                            className="text-white hover:bg-white/10"
                          >
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Dialog */}
        {editingRecord && (
          <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
            <DialogContent className="bg-gray-900 text-white border-white/20 max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Payroll Record</DialogTitle>
              </DialogHeader>
              <PayrollForm profiles={profiles} record={editingRecord} onSave={handleSaveRecord} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const PayrollForm = ({ 
  profiles, 
  record, 
  onSave 
}: { 
  profiles: Profile[]; 
  record?: PayrollRecord | null; 
  onSave: (record: Partial<PayrollRecord>) => void;
}) => {
  const [formData, setFormData] = useState({
    user_id: record?.user_id || '',
    employee_id: record?.employee_id || '',
    base_salary: record?.base_salary || 0,
    bonus: record?.bonus || 0,
    deductions: record?.deductions || 0,
    currency: record?.currency || 'USD',
    pay_period: record?.pay_period || 'monthly',
    status: record?.status || 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Employee</label>
          <Select value={formData.user_id} onValueChange={(value) => {
            const profile = profiles.find(p => p.id === value);
            setFormData({ 
              ...formData, 
              user_id: value, 
              employee_id: profile?.employee_id || '' 
            });
          }}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select employee" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Employee ID</label>
          <Input
            value={formData.employee_id}
            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Base Salary</label>
          <Input
            type="number"
            step="0.01"
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
            step="0.01"
            value={formData.bonus}
            onChange={(e) => setFormData({ ...formData, bonus: parseFloat(e.target.value) })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Deductions</label>
          <Input
            type="number"
            step="0.01"
            value={formData.deductions}
            onChange={(e) => setFormData({ ...formData, deductions: parseFloat(e.target.value) })}
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Pay Period</label>
          <Select value={formData.pay_period} onValueChange={(value) => setFormData({ ...formData, pay_period: value })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">Status</label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
        {record ? 'Update' : 'Create'} Payroll Record
      </Button>
    </form>
  );
};

export default Payroll;
