type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_data: {
        Row: {
          created_at: string
          id: string
          metric_date: string
          metric_name: string
          metric_value: number
          team_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_date?: string
          metric_name: string
          metric_value: number
          team_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_date?: string
          metric_name?: string
          metric_value?: number
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_data_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_tag: string
          assigned_to: string | null
          category: string
          created_at: string
          id: string
          location: string | null
          manufacturer: string | null
          model: string | null
          name: string
          notes: string | null
          org_id: string | null
          purchase_date: string | null
          serial_number: string | null
          status: string | null
          updated_at: string
          value: number | null
          warranty_expiry: string | null
        }
        Insert: {
          asset_tag: string
          assigned_to?: string | null
          category: string
          created_at?: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name: string
          notes?: string | null
          org_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string
          value?: number | null
          warranty_expiry?: string | null
        }
        Update: {
          asset_tag?: string
          assigned_to?: string | null
          category?: string
          created_at?: string
          id?: string
          location?: string | null
          manufacturer?: string | null
          model?: string | null
          name?: string
          notes?: string | null
          org_id?: string | null
          purchase_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string
          value?: number | null
          warranty_expiry?: string | null
        }
        Relationships: []
      }
      audit_events: {
        Row: {
          created_at: string | null
          description: string
          event_type: string
          id: string
          metadata: Json | null
          org_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          event_type: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string | null
        }
        Relationships: []
      }
      automations: {
        Row: {
          action_config: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          team_id: string | null
          trigger_config: Json
          user_id: string
        }
        Insert: {
          action_config: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          team_id?: string | null
          trigger_config: Json
          user_id: string
        }
        Update: {
          action_config?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          team_id?: string | null
          trigger_config?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "automations_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      benefits: {
        Row: {
          category: string
          cost: number | null
          created_at: string
          description: string | null
          employer_contribution_percent: number | null
          id: string
          is_active: boolean | null
          name: string
          provider: string | null
        }
        Insert: {
          category: string
          cost?: number | null
          created_at?: string
          description?: string | null
          employer_contribution_percent?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          provider?: string | null
        }
        Update: {
          category?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          employer_contribution_percent?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string | null
        }
        Relationships: []
      }
      channels: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          org_id: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          org_id?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          org_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          ai_enhanced: boolean | null
          content: string
          created_at: string
          id: string
          message_type: string | null
          metadata: Json | null
          parent_message_id: string | null
          room_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_enhanced?: boolean | null
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          parent_message_id?: string | null
          room_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_enhanced?: boolean | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          metadata?: Json | null
          parent_message_id?: string | null
          room_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "chat_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rooms: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          org_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          org_id?: string | null
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          org_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      compensation_history: {
        Row: {
          change_reason: string | null
          created_at: string
          created_by: string
          currency: string | null
          effective_date: string
          id: string
          notes: string | null
          salary: number
          user_id: string
        }
        Insert: {
          change_reason?: string | null
          created_at?: string
          created_by: string
          currency?: string | null
          effective_date: string
          id?: string
          notes?: string | null
          salary: number
          user_id: string
        }
        Update: {
          change_reason?: string | null
          created_at?: string
          created_by?: string
          currency?: string | null
          effective_date?: string
          id?: string
          notes?: string | null
          salary?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compensation_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compensation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_tasks: {
        Row: {
          assigned_to: string | null
          audit_event_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          org_id: string | null
          priority: string | null
          status: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          audit_event_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          org_id?: string | null
          priority?: string | null
          status?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          audit_event_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          org_id?: string | null
          priority?: string | null
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_tasks_audit_event_id_fkey"
            columns: ["audit_event_id"]
            isOneToOne: false
            referencedRelation: "audit_events"
            referencedColumns: ["id"]
          },
        ]
      }
      connectors: {
        Row: {
          config: Json | null
          created_at: string | null
          id: string
          last_sync_at: string | null
          org_id: string | null
          provider_name: string
          provider_type: string
          status: string | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          org_id?: string | null
          provider_name: string
          provider_type: string
          status?: string | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          org_id?: string | null
          provider_name?: string
          provider_type?: string
          status?: string | null
        }
        Relationships: []
      }
      contract_approvals: {
        Row: {
          approved_at: string | null
          approver_id: string | null
          comments: string | null
          contract_id: string | null
          created_at: string
          id: string
          status: string
        }
        Insert: {
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          contract_id?: string | null
          created_at?: string
          id?: string
          status: string
        }
        Update: {
          approved_at?: string | null
          approver_id?: string | null
          comments?: string | null
          contract_id?: string | null
          created_at?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_approvals_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          ai_summary: string | null
          assigned_to: string | null
          contract_type: string
          created_at: string
          created_by: string | null
          currency: string | null
          expiry_date: string | null
          file_path: string | null
          id: string
          key_terms: Json | null
          org_id: string | null
          status: string | null
          title: string
          updated_at: string
          value: number | null
        }
        Insert: {
          ai_summary?: string | null
          assigned_to?: string | null
          contract_type: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          key_terms?: Json | null
          org_id?: string | null
          status?: string | null
          title: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          ai_summary?: string | null
          assigned_to?: string | null
          contract_type?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          key_terms?: Json | null
          org_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      document_acknowledgments: {
        Row: {
          acknowledged_at: string
          document_id: string
          id: string
          ip_address: unknown | null
          user_id: string
        }
        Insert: {
          acknowledged_at?: string
          document_id: string
          id?: string
          ip_address?: unknown | null
          user_id: string
        }
        Update: {
          acknowledged_at?: string
          document_id?: string
          id?: string
          ip_address?: unknown | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_acknowledgments_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_acknowledgments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          is_confidential: boolean | null
          mime_type: string | null
          requires_acknowledgment: boolean | null
          title: string
          uploaded_by: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          is_confidential?: boolean | null
          mime_type?: string | null
          requires_acknowledgment?: boolean | null
          title: string
          uploaded_by: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_confidential?: boolean | null
          mime_type?: string | null
          requires_acknowledgment?: boolean | null
          title?: string
          uploaded_by?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          active: boolean | null
          base_salary: number | null
          bonuses: number | null
          country: string | null
          created_at: string
          currency: string | null
          deductions: number | null
          id: string
          name: string
          org_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          base_salary?: number | null
          bonuses?: number | null
          country?: string | null
          created_at?: string
          currency?: string | null
          deductions?: number | null
          id?: string
          name: string
          org_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          base_salary?: number | null
          bonuses?: number | null
          country?: string | null
          created_at?: string
          currency?: string | null
          deductions?: number | null
          id?: string
          name?: string
          org_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feedback_entries: {
        Row: {
          content: string
          created_at: string
          feedback_type: string
          from_user_id: string
          id: string
          is_anonymous: boolean
          sentiment_score: string | null
          title: string
          to_user_id: string
          visibility: string
        }
        Insert: {
          content: string
          created_at?: string
          feedback_type?: string
          from_user_id: string
          id?: string
          is_anonymous?: boolean
          sentiment_score?: string | null
          title: string
          to_user_id: string
          visibility?: string
        }
        Update: {
          content?: string
          created_at?: string
          feedback_type?: string
          from_user_id?: string
          id?: string
          is_anonymous?: boolean
          sentiment_score?: string | null
          title?: string
          to_user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_entries_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_entries_to_user_id_fkey"
            columns: ["to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_records: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string | null
          id: string
          team_id: string | null
          transaction_date: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          team_id?: string | null
          transaction_date?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          team_id?: string | null
          transaction_date?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_records_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_settings: {
        Row: {
          created_at: string
          default_currency: string | null
          footer_note: string | null
          id: string
          invoice_logo_url: string | null
          org_id: string | null
          razorpay_key: string | null
          stripe_key: string | null
          tax_percentage: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_currency?: string | null
          footer_note?: string | null
          id?: string
          invoice_logo_url?: string | null
          org_id?: string | null
          razorpay_key?: string | null
          stripe_key?: string | null
          tax_percentage?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_currency?: string | null
          footer_note?: string | null
          id?: string
          invoice_logo_url?: string | null
          org_id?: string | null
          razorpay_key?: string | null
          stripe_key?: string | null
          tax_percentage?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      financial_metrics: {
        Row: {
          calculated_at: string
          expenses: number | null
          growth_rate: number | null
          id: string
          month: string
          net_profit: number | null
          org_id: string | null
          revenue: number | null
          roic: number | null
          rule_of_40: number | null
        }
        Insert: {
          calculated_at?: string
          expenses?: number | null
          growth_rate?: number | null
          id?: string
          month: string
          net_profit?: number | null
          org_id?: string | null
          revenue?: number | null
          roic?: number | null
          rule_of_40?: number | null
        }
        Update: {
          calculated_at?: string
          expenses?: number | null
          growth_rate?: number | null
          id?: string
          month?: string
          net_profit?: number | null
          org_id?: string | null
          revenue?: number | null
          roic?: number | null
          rule_of_40?: number | null
        }
        Relationships: []
      }
      flow_runs: {
        Row: {
          completed_at: string | null
          error_message: string | null
          execution_time_ms: number | null
          flow_id: string
          id: string
          input_data: Json | null
          output_data: Json | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          flow_id: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          error_message?: string | null
          execution_time_ms?: number | null
          flow_id?: string
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_runs_flow_id_fkey"
            columns: ["flow_id"]
            isOneToOne: false
            referencedRelation: "flows"
            referencedColumns: ["id"]
          },
        ]
      }
      flows: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          flow_definition: Json
          id: string
          name: string
          org_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          flow_definition: Json
          id?: string
          name: string
          org_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          flow_definition?: Json
          id?: string
          name?: string
          org_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      industry_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string
          is_active: boolean | null
          modules: Json | null
          name: string
          template_config: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry: string
          is_active?: boolean | null
          modules?: Json | null
          name: string
          template_config?: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string
          is_active?: boolean | null
          modules?: Json | null
          name?: string
          template_config?: Json
        }
        Relationships: []
      }
      innovation_ideas: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: string | null
          team_id: string | null
          title: string
          user_id: string
          votes: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          team_id?: string | null
          title: string
          user_id: string
          votes?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          team_id?: string | null
          title?: string
          user_id?: string
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "innovation_ideas_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_configs: {
        Row: {
          config: Json
          created_at: string
          credentials: Json | null
          id: string
          last_sync: string | null
          org_id: string | null
          service_name: string
          service_type: string
          status: string | null
        }
        Insert: {
          config?: Json
          created_at?: string
          credentials?: Json | null
          id?: string
          last_sync?: string | null
          org_id?: string | null
          service_name: string
          service_type: string
          status?: string | null
        }
        Update: {
          config?: Json
          created_at?: string
          credentials?: Json | null
          id?: string
          last_sync?: string | null
          org_id?: string | null
          service_name?: string
          service_type?: string
          status?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_email: string
          client_id: string | null
          client_name: string
          created_at: string
          created_by: string | null
          currency: string | null
          description: string | null
          due_date: string | null
          id: string
          invoice_number: string
          issued_date: string | null
          items: Json | null
          notes: string | null
          org_id: string | null
          payment_url: string | null
          status: string | null
          subtotal: number
          tax: number | null
          total: number
          updated_at: string
        }
        Insert: {
          amount?: number
          client_email: string
          client_id?: string | null
          client_name: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issued_date?: string | null
          items?: Json | null
          notes?: string | null
          org_id?: string | null
          payment_url?: string | null
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          client_email?: string
          client_id?: string | null
          client_name?: string
          created_at?: string
          created_by?: string | null
          currency?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issued_date?: string | null
          items?: Json | null
          notes?: string | null
          org_id?: string | null
          payment_url?: string | null
          status?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_logs: {
        Row: {
          asset_id: string | null
          completed_date: string | null
          cost: number | null
          created_at: string
          description: string
          id: string
          maintenance_type: string
          performed_by: string | null
          scheduled_date: string | null
          status: string | null
        }
        Insert: {
          asset_id?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description: string
          id?: string
          maintenance_type: string
          performed_by?: string | null
          scheduled_date?: string | null
          status?: string | null
        }
        Update: {
          asset_id?: string | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          description?: string
          id?: string
          maintenance_type?: string
          performed_by?: string | null
          scheduled_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_logs_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          channel_id: string
          content: string
          created_at: string | null
          id: string
          message_type: string | null
          metadata: Json | null
          thread_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          content: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          thread_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          content?: string
          created_at?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          thread_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      morale_entries: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          morale_score: number
          sentiment: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          morale_score: number
          sentiment: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          morale_score?: number
          sentiment?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "morale_entries_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "morale_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_private: boolean | null
          team_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          team_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          team_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      okr_nudges: {
        Row: {
          acknowledged_at: string | null
          ai_generated: boolean | null
          content: string
          created_at: string
          delivered_at: string | null
          id: string
          nudge_type: string
          okr_id: string | null
          user_id: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          ai_generated?: boolean | null
          content: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          nudge_type: string
          okr_id?: string | null
          user_id?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          ai_generated?: boolean | null
          content?: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          nudge_type?: string
          okr_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "okr_nudges_okr_id_fkey"
            columns: ["okr_id"]
            isOneToOne: false
            referencedRelation: "okrs"
            referencedColumns: ["id"]
          },
        ]
      }
      okrs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          key_results: Json
          objective: string
          progress_percentage: number | null
          quarter: string
          status: string | null
          team_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          key_results: Json
          objective: string
          progress_percentage?: number | null
          quarter: string
          status?: string | null
          team_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          key_results?: Json
          objective?: string
          progress_percentage?: number | null
          quarter?: string
          status?: string | null
          team_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "okrs_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "okrs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_sessions: {
        Row: {
          completed_at: string | null
          current_step: number | null
          id: string
          session_data: Json | null
          started_at: string
          status: string | null
          user_id: string | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          session_data?: Json | null
          started_at?: string
          status?: string | null
          user_id?: string | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          current_step?: number | null
          id?: string
          session_data?: Json | null
          started_at?: string
          status?: string | null
          user_id?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_sessions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "onboarding_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_workflows: {
        Row: {
          ai_config: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          org_id: string | null
          updated_at: string
          workflow_config: Json
        }
        Insert: {
          ai_config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          org_id?: string | null
          updated_at?: string
          workflow_config?: Json
        }
        Update: {
          ai_config?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          org_id?: string | null
          updated_at?: string
          workflow_config?: Json
        }
        Relationships: []
      }
      payroll: {
        Row: {
          base_salary: number
          bonus: number | null
          created_at: string
          currency: string | null
          deductions: number | null
          employee_id: string
          gross_salary: number
          id: string
          net_salary: number
          pay_period: string | null
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          base_salary?: number
          bonus?: number | null
          created_at?: string
          currency?: string | null
          deductions?: number | null
          employee_id: string
          gross_salary?: number
          id?: string
          net_salary?: number
          pay_period?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          base_salary?: number
          bonus?: number | null
          created_at?: string
          currency?: string | null
          deductions?: number | null
          employee_id?: string
          gross_salary?: number
          id?: string
          net_salary?: number
          pay_period?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payroll_runs: {
        Row: {
          created_at: string
          employee_id: string | null
          gross_salary: number
          id: string
          month: string
          net_salary: number
          org_id: string | null
          payslip_url: string | null
          processed_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          gross_salary: number
          id?: string
          month: string
          net_salary: number
          org_id?: string | null
          payslip_url?: string | null
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          gross_salary?: number
          id?: string
          month?: string
          net_salary?: number
          org_id?: string | null
          payslip_url?: string | null
          processed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_runs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_goals: {
        Row: {
          created_at: string
          current_value: number | null
          deadline: string | null
          description: string | null
          id: string
          status: string | null
          target_value: number | null
          team_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string | null
          target_value?: number | null
          team_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          status?: string | null
          target_value?: number | null
          team_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_goals_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          competency_rating: number | null
          created_at: string
          development_plan: string | null
          due_date: string | null
          feedback: string | null
          goals_achievement_rating: number | null
          id: string
          overall_rating: number | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          competency_rating?: number | null
          created_at?: string
          development_plan?: string | null
          due_date?: string | null
          feedback?: string | null
          goals_achievement_rating?: number | null
          id?: string
          overall_rating?: number | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          competency_rating?: number | null
          created_at?: string
          development_plan?: string | null
          due_date?: string | null
          feedback?: string | null
          goals_achievement_rating?: number | null
          id?: string
          overall_rating?: number | null
          review_period_end?: string
          review_period_start?: string
          reviewer_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_assignments: {
        Row: {
          active: boolean | null
          assigned_by: string | null
          created_at: string
          end_date: string | null
          id: string
          org_id: string | null
          plan_id: string | null
          start_date: string | null
        }
        Insert: {
          active?: boolean | null
          assigned_by?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          org_id?: string | null
          plan_id?: string | null
          start_date?: string | null
        }
        Update: {
          active?: boolean | null
          assigned_by?: string | null
          created_at?: string
          end_date?: string | null
          id?: string
          org_id?: string | null
          plan_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_assignments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          base_price: number | null
          created_at: string
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_per_user: number | null
          type: string
          usage_price: number | null
          usage_unit: string | null
        }
        Insert: {
          base_price?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_per_user?: number | null
          type: string
          usage_price?: number | null
          usage_unit?: string | null
        }
        Update: {
          base_price?: number | null
          created_at?: string
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_per_user?: number | null
          type?: string
          usage_price?: number | null
          usage_unit?: string | null
        }
        Relationships: []
      }
      policies: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          org_id: string | null
          status: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          org_id?: string | null
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          org_id?: string | null
          status?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      presence_status: {
        Row: {
          id: string
          last_seen: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          last_seen?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          last_seen?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_id: string | null
          employment_status: string | null
          full_name: string | null
          hire_date: string | null
          id: string
          job_title: string | null
          location: string | null
          phone: string | null
          skills: string[] | null
          timezone: string | null
          workspace_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          employment_status?: string | null
          full_name?: string | null
          hire_date?: string | null
          id: string
          job_title?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          timezone?: string | null
          workspace_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_id?: string | null
          employment_status?: string | null
          full_name?: string | null
          hire_date?: string | null
          id?: string
          job_title?: string | null
          location?: string | null
          phone?: string | null
          skills?: string[] | null
          timezone?: string | null
          workspace_type?: string | null
        }
        Relationships: []
      }
      sync_jobs: {
        Row: {
          completed_at: string | null
          connector_id: string
          error_message: string | null
          id: string
          records_processed: number | null
          started_at: string | null
          status: string | null
        }
        Insert: {
          completed_at?: string | null
          connector_id: string
          error_message?: string | null
          id?: string
          records_processed?: number | null
          started_at?: string | null
          status?: string | null
        }
        Update: {
          completed_at?: string | null
          connector_id?: string
          error_message?: string | null
          id?: string
          records_processed?: number | null
          started_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_jobs_connector_id_fkey"
            columns: ["connector_id"]
            isOneToOne: false
            referencedRelation: "connectors"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          completed_at: string | null
          error_details: string | null
          id: string
          integration_id: string | null
          records_processed: number | null
          started_at: string
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          integration_id?: string | null
          records_processed?: number | null
          started_at?: string
          status: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          error_details?: string | null
          id?: string
          integration_id?: string | null
          records_processed?: number | null
          started_at?: string
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integration_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      template_deployments: {
        Row: {
          created_at: string
          deployed_at: string | null
          deployment_config: Json | null
          id: string
          org_id: string | null
          status: string | null
          template_id: string | null
        }
        Insert: {
          created_at?: string
          deployed_at?: string | null
          deployment_config?: Json | null
          id?: string
          org_id?: string | null
          status?: string | null
          template_id?: string | null
        }
        Update: {
          created_at?: string
          deployed_at?: string | null
          deployment_config?: Json | null
          id?: string
          org_id?: string | null
          status?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "template_deployments_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "industry_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          break_duration: number | null
          clock_in: string
          clock_out: string | null
          created_at: string
          id: string
          notes: string | null
          overtime_hours: number | null
          status: string | null
          total_hours: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          break_duration?: number | null
          clock_in: string
          clock_out?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          break_duration?: number | null
          clock_in?: string
          clock_out?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          overtime_hours?: number | null
          status?: string | null
          total_hours?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          currency: string | null
          id: string
          invoice_id: string | null
          org_id: string | null
          payment_method: string | null
          razorpay_payment_id: string | null
          receipt_url: string | null
          status: string | null
          stripe_payment_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          invoice_id?: string | null
          org_id?: string | null
          payment_method?: string | null
          razorpay_payment_id?: string | null
          receipt_url?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          invoice_id?: string | null
          org_id?: string | null
          payment_method?: string | null
          razorpay_payment_id?: string | null
          receipt_url?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      user_benefits: {
        Row: {
          benefit_id: string
          created_at: string
          employee_contribution: number | null
          enrollment_date: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          benefit_id: string
          created_at?: string
          employee_contribution?: number | null
          enrollment_date?: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          benefit_id?: string
          created_at?: string
          employee_contribution?: number | null
          enrollment_date?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_benefits_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_benefits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          execution_time_ms: number | null
          id: string
          input_data: Json | null
          output_data: Json | null
          started_at: string
          status: string
          workflow_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string
          status?: string
          workflow_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          started_at?: string
          status?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          description: string | null
          flow_definition: Json
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          flow_definition?: Json
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          flow_definition?: Json
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_financial_metrics: {
        Args: { org_uuid: string; target_month: string }
        Returns: undefined
      }
    }
    Enums: {
      team_role: "owner" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

const Constants = {
  public: {
    Enums: {
      team_role: ["owner", "admin", "member"],
    },
  },
} as const
