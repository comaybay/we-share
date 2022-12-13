export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      post_question_comment_stars: {
        Row: {
          date_created: string
          user_id: string
          comment_id: number
        }
        Insert: {
          date_created?: string
          user_id: string
          comment_id: number
        }
        Update: {
          date_created?: string
          user_id?: string
          comment_id?: number
        }
      }
      post_question_comments: {
        Row: {
          id: number
          date_created: string
          date_last_updated: string | null
          content: string
          author_id: string
          parent_comment_id: number | null
          post_id: number
        }
        Insert: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          content: string
          author_id: string
          parent_comment_id?: number | null
          post_id: number
        }
        Update: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          content?: string
          author_id?: string
          parent_comment_id?: number | null
          post_id?: number
        }
      }
      post_question_stars: {
        Row: {
          date_created: string
          user_id: string
          post_id: number
        }
        Insert: {
          date_created?: string
          user_id: string
          post_id: number
        }
        Update: {
          date_created?: string
          user_id?: string
          post_id?: number
        }
      }
      post_questions: {
        Row: {
          id: number
          date_created: string
          date_last_updated: string | null
          title: string
          slug: string
          content: string
          topics: string[]
          favorite_answer_id: number | null
          author_id: string
          text_content: string
          view_count: number
          post_question_stars_count: number
        }
        Insert: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          title: string
          slug: string
          content: string
          topics: string[]
          favorite_answer_id?: number | null
          author_id: string
          text_content: string
          view_count?: number
        }
        Update: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          title?: string
          slug?: string
          content?: string
          topics?: string[]
          favorite_answer_id?: number | null
          author_id?: string
          text_content?: string
          view_count?: number
        }
      }
      post_sharing_bookmarks: {
        Row: {
          date_created: string
          user_id: string
          post_id: number
        }
        Insert: {
          date_created: string
          user_id: string
          post_id: number
        }
        Update: {
          date_created?: string
          user_id?: string
          post_id?: number
        }
      }
      post_sharing_comment_stars: {
        Row: {
          date_created: string
          user_id: string
          comment_id: number
        }
        Insert: {
          date_created?: string
          user_id: string
          comment_id: number
        }
        Update: {
          date_created?: string
          user_id?: string
          comment_id?: number
        }
      }
      post_sharing_comments: {
        Row: {
          id: number
          date_created: string
          date_last_updated: string | null
          text_content: string
          content: string
          author_id: string
          parent_comment_id: number | null
          post_id: number
        }
        Insert: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          text_content: string
          content: string
          author_id: string
          parent_comment_id?: number | null
          post_id: number
        }
        Update: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          text_content?: string
          content?: string
          author_id?: string
          parent_comment_id?: number | null
          post_id?: number
        }
      }
      post_sharing_stars: {
        Row: {
          date_created: string
          user_id: string
          post_id: number
        }
        Insert: {
          date_created?: string
          user_id: string
          post_id: number
        }
        Update: {
          date_created?: string
          user_id?: string
          post_id?: number
        }
      }
      post_sharings: {
        Row: {
          id: number
          date_created: string
          date_last_updated: string | null
          title: string
          slug: string
          content: string
          topics: string[]
          author_id: string
          view_count: number
          text_content: string
          post_sharing_stars_count: number
        }
        Insert: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          title: string
          slug: string
          content: string
          topics: string[]
          author_id: string
          view_count?: number
          text_content: string
        }
        Update: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          title?: string
          slug?: string
          content?: string
          topics?: string[]
          author_id?: string
          view_count?: number
          text_content?: string
        }
      }
      post_team_comments: {
        Row: {
          id: number
          date_created: string
          date_last_updated: string | null
          content: string
          author_id: string
          parent_comment_id: number | null
          post_id: number
        }
        Insert: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          content: string
          author_id: string
          parent_comment_id?: number | null
          post_id: number
        }
        Update: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          content?: string
          author_id?: string
          parent_comment_id?: number | null
          post_id?: number
        }
      }
      post_team_members: {
        Row: {
          date_created: string
          post_team_id: number
          member_id: string
        }
        Insert: {
          date_created?: string
          post_team_id: number
          member_id: string
        }
        Update: {
          date_created?: string
          post_team_id?: number
          member_id?: string
        }
      }
      post_teams: {
        Row: {
          id: number
          date_created: string
          date_last_updated: string | null
          title: string
          slug: string
          content: string
          course_code: string
          needed_skills: string[]
          author_id: string
          view_count: number
          text_content: string
          team_size: number
          is_team_full: boolean
        }
        Insert: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          title: string
          slug: string
          content: string
          course_code: string
          needed_skills: string[]
          author_id: string
          view_count?: number
          text_content: string
          team_size: number
          is_team_full?: boolean
        }
        Update: {
          id?: number
          date_created?: string
          date_last_updated?: string | null
          title?: string
          slug?: string
          content?: string
          course_code?: string
          needed_skills?: string[]
          author_id?: string
          view_count?: number
          text_content?: string
          team_size?: number
          is_team_full?: boolean
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          name: string | null
          quote: string | null
          email: string
        }
        Insert: {
          id: string
          username?: string | null
          name?: string | null
          quote?: string | null
          email: string
        }
        Update: {
          id?: string
          username?: string | null
          name?: string | null
          quote?: string | null
          email?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      post_question_stars_count: {
        Args: { "": unknown }
        Returns: number
      }
      post_questions_count_duplicated_slug: {
        Args: { _author_id: string; _slug: string }
        Returns: number
      }
      post_sharing_stars_count: {
        Args: { "": unknown }
        Returns: number
      }
      post_sharings_count_duplicated_slug: {
        Args: { _author_id: string; _slug: string }
        Returns: number
      }
      post_teams_count_duplicated_slug: {
        Args: { _author_id: string; _slug: string }
        Returns: number
      }
      test: {
        Args: { slug: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
