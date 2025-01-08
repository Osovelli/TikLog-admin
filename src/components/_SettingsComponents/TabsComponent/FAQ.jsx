import React, { useState } from 'react'
import { Trash2, Plus, Pencil } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { CustomButton } from '@/components/CustomButton'

const FAQ = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "How do you make holy water?",
      answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quas cupiditate laboriosam fugiat."
    },
    {
      id: 2,
      question: "How do you make holy water?",
      answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quas cupiditate laboriosam fugiat."
    },
    {
      id: 3,
      question: "How do you make holy water?",
      answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quas cupiditate laboriosam fugiat."
    }
  ])

  const addFaq = () => {
    const newFaq = {
      id: Date.now(),
      question: "Question goes in here...",
      answer: "Answer goes in here..."
    }
    setFaqs([...faqs, newFaq])
  }

  const updateFaq = (id, field, value) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ))
  }

  const deleteFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id))
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          <div className='flex gap-2'>
            <Button 
            onClick={addFaq}
            className="bg-indigo-600 hover:bg-indigo-700"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
            </Button>
            <Button 
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="bg-white text-black hover:bg-gray-200"
            >
                <Pencil className="w-4 h-4 mr-2" />
                Edit FAQ
            </Button>
          </div>       
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <React.Fragment key={faq.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <h3 className="text-gray-400 font-medium">{faq.question}</h3>
                <p className="text-gray-400">{faq.answer}</p>
              </div>
              {index < faqs.length - 1 && (
                <Separator className="bg-gray-100" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                className="flex-1 text-black border rounded-lg p-4 focus:ring-0 focus:ring-indigo-500"
                placeholder="Question goes in here..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteFaq(faq.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <textarea
              value={faq.answer}
              onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
              className="w-full  text-black border rounded-lg p-4 focus:ring-0 focus:ring-indigo-500 min-h-[100px]"
              placeholder="Answer goes in here..."
            />
          </div>
        ))}
         <div className='flex justify-end'>
            <CustomButton 
            buttonVariant={'primary'} 
            buttonSize={'md'} 
            onClick={() => setIsEditing(false)}>
                Save Changes
            </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default FAQ

/* import React, { useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

const FAQ = () => {
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "How do you make holy water?",
      answer: "You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quis quis dictate laconsecur fugiat."
    },
    {
      id: 2,
      question: "Question goes in here...",
      answer: "Answer goes in here..."
    },
    {
      id: 3,
      question: "Question goes in here...",
      answer: "Answer goes in here..."
    }
  ])

  const addFaq = () => {
    const newFaq = {
      id: Date.now(),
      question: "Question goes in here...",
      answer: "Answer goes in here..."
    }
    setFaqs([...faqs, newFaq])
  }

  const updateFaq = (id, field, value) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ))
  }

  const deleteFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        <Button 
          onClick={addFaq}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(faq.id, 'question', e.target.value)}
                className="flex-1 text-black border rounded-lg p-4 focus:ring-0 focus:ring-indigo-500"
                placeholder="Question goes in here..."
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteFaq(faq.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-950"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <textarea
              value={faq.answer}
              onChange={(e) => updateFaq(faq.id, 'answer', e.target.value)}
              className="w-full  text-black border rounded-lg p-4 focus:ring-0 focus:ring-indigo-500 min-h-[100px]"
              placeholder="Answer goes in here..."
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ */