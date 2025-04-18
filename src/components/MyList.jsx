import React from 'react'
import MyIssueCard from './MyIssueCard'
import '../App.css'

function MyList({data}) {
    
  return (
    <div>
        
        <div className='max-h-[90vh] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hidden'>
            {data.length > 0 ? data.map((issue,index) => <MyIssueCard key={index} data={issue} /> ): "No Reports yet"}
        </div>
    </div>
  )
}

export default MyList