
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { X } from 'lucide-react';

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  node?: Node | null;
  onUpdateNode?: (node: Node) => void;
}

const ConfigDrawer = ({ isOpen, onClose, node, onUpdateNode }: ConfigDrawerProps) => {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    if (node) {
      setConfig(node.data || {});
    }
  }, [node]);

  const handleSave = () => {
    if (node && onUpdateNode) {
      const updatedNode = {
        ...node,
        data: {
          ...config,
          configured: true,
        },
      };
      onUpdateNode(updatedNode);
    }
    onClose();
  };

  const renderConfigFields = () => {
    if (!node) return null;

    switch (node.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="triggerType">Trigger Type</Label>
              <select
                id="triggerType"
                value={config.triggerType || ''}
                onChange={(e) => setConfig({ ...config, triggerType: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md bg-gray-800 border-gray-600 text-white"
              >
                <option value="">Select trigger type</option>
                <option value="webhook">Webhook</option>
                <option value="schedule">Schedule</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            {config.triggerType === 'webhook' && (
              <div>
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={config.webhookUrl || ''}
                  onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                  placeholder="https://example.com/webhook"
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            )}
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="actionType">Action Type</Label>
              <select
                id="actionType"
                value={config.actionType || ''}
                onChange={(e) => setConfig({ ...config, actionType: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md bg-gray-800 border-gray-600 text-white"
              >
                <option value="">Select action type</option>
                <option value="send_email">Send Email</option>
                <option value="create_record">Create Record</option>
                <option value="api_call">API Call</option>
              </select>
            </div>
            {config.actionType === 'send_email' && (
              <>
                <div>
                  <Label htmlFor="emailTo">To Email</Label>
                  <Input
                    id="emailTo"
                    value={config.emailTo || ''}
                    onChange={(e) => setConfig({ ...config, emailTo: e.target.value })}
                    placeholder="recipient@example.com"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="emailSubject">Subject</Label>
                  <Input
                    id="emailSubject"
                    value={config.emailSubject || ''}
                    onChange={(e) => setConfig({ ...config, emailSubject: e.target.value })}
                    placeholder="Email subject"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="emailBody">Body</Label>
                  <Textarea
                    id="emailBody"
                    value={config.emailBody || ''}
                    onChange={(e) => setConfig({ ...config, emailBody: e.target.value })}
                    placeholder="Email body"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </>
            )}
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="field">Field</Label>
              <Input
                id="field"
                value={config.field || ''}
                onChange={(e) => setConfig({ ...config, field: e.target.value })}
                placeholder="Field to check"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="operator">Operator</Label>
              <select
                id="operator"
                value={config.operator || ''}
                onChange={(e) => setConfig({ ...config, operator: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md bg-gray-800 border-gray-600 text-white"
              >
                <option value="">Select operator</option>
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="greater_than">Greater Than</option>
                <option value="less_than">Less Than</option>
              </select>
            </div>
            <div>
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                value={config.value || ''}
                onChange={(e) => setConfig({ ...config, value: e.target.value })}
                placeholder="Value to compare"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                type="number"
                value={config.duration || ''}
                onChange={(e) => setConfig({ ...config, duration: e.target.value })}
                placeholder="Duration"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <select
                id="unit"
                value={config.unit || ''}
                onChange={(e) => setConfig({ ...config, unit: e.target.value })}
                className="w-full mt-1 p-2 border rounded-md bg-gray-800 border-gray-600 text-white"
              >
                <option value="">Select unit</option>
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-gray-400">No configuration available for this node type.</p>
          </div>
        );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-gray-900 border-gray-700 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">
            Configure {node?.type || 'Node'}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Configure the settings for this workflow node.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div>
            <Label htmlFor="label">Node Label</Label>
            <Input
              id="label"
              value={config.label || ''}
              onChange={(e) => setConfig({ ...config, label: e.target.value })}
              placeholder="Node label"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          {renderConfigFields()}

          <div className="flex gap-3 pt-6">
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
              Save Configuration
            </Button>
            <Button variant="outline" onClick={onClose} className="border-gray-600 text-gray-300">
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ConfigDrawer;
