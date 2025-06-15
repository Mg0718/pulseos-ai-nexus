export type Json =
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

export type Tables<
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

export type TablesInsert<
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

export type TablesUpdate<
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

export type Enums<
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

export type CompositeTypes<
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

export const Constants = {
  public: {
    Enums: {
      team_role: ["owner", "admin", "member"],
    },
  },
} as const
