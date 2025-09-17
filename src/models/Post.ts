import mongoose, { Document, Schema } from 'mongoose'

export interface IPost extends Document {
  title: string
  content: string
  excerpt: string
  thumbnail: string
  category: string
  author: string
  slug: string
  published: boolean
  createdAt: Date
  updatedAt: Date
  views: number
  tags: string[]
}

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content for this post'],
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt for this post'],
    maxlength: [300, 'Excerpt cannot be more than 300 characters'],
  },
  thumbnail: {
    type: String,
    required: [true, 'Please provide a thumbnail URL'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['AI & Machine Learning', 'Web Development', 'Mobile Development', 'DevOps', 'Cybersecurity', 'Blockchain', 'Data Science', 'Cloud Computing', 'IoT', 'General Tech', 'Announcement'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    default: 'TechBlog Admin',
  },
  slug: {
    type: String,
    unique: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  tags: [{
    type: String,
  }],
}, {
  timestamps: true,
})

// Note: Slug generation is now handled in the API route for better control

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
