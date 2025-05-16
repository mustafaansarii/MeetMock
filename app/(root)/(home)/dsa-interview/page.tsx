'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import Loader from '@/components/Loader';
import { Textarea } from '@/components/ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DSAInterviewPage = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    meetingType: 'dsa',
    dsaLevel: '',
  });
  const client = useStreamVideoClient();
  const { user } = useUser();
  const { toast } = useToast();

  const getQuestionLink = (level: string) => {
    switch(level) {
      case 'beginner': return 'https://www.geeksforgeeks.org/top-50-dsa-problems-for-beginners/';
      case 'medium': return 'https://leetcode.com/problemset/all/?difficulty=MEDIUM';
      case 'hard': return 'https://leetcode.com/problemset/all/?difficulty=HARD';
      default: return '';
    }
  };

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast({ title: 'Please select a date and time' });
        return;
      }
      if (values.dateTime < new Date()) {
        toast({ title: 'Please select a future date and time' });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create meeting');
      
      await call.getOrCreate({
        data: {
          starts_at: values.dateTime.toISOString(),
          custom: {
            description: `DSA Mock Interview (${values.dsaLevel})`,
            meetingType: values.meetingType,
            dsaLevel: values.dsaLevel,
          },
        },
      });

      const link = getQuestionLink(values.dsaLevel);
      toast({
        title: 'DSA Question Link',
        description: (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            Click here for {values.dsaLevel} level questions
          </a>
        ),
      });

      router.push(`/meeting/${call.id}`);
      toast({ title: 'Meeting Created' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Failed to create Meeting' });
    }
  };

  if (!client || !user) return <Loader />;

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Schedule DSA/Behavioral Interview</h1>
      
      <div className="flex max-w-[500px] flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-base font-normal leading-[22.4px] text-sky-2">
            Interview Type
          </label>
          <Select
            value={values.meetingType}
            onValueChange={(value) => setValues({ ...values, meetingType: value })}
          >
            <SelectTrigger className="w-full border-none bg-dark-3">
              <SelectValue placeholder="Select interview type" />
            </SelectTrigger>
            <SelectContent className="bg-dark-3 text-white">
              <SelectItem value="dsa">DSA Mock Interview</SelectItem>
              <SelectItem value="behavioral">Behavioral Interview</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {values.meetingType === 'dsa' && (
          <div className="flex flex-col gap-2">
            <label className="text-base font-normal leading-[22.4px] text-sky-2">
              DSA Level
            </label>
            <Select
              value={values.dsaLevel}
              onValueChange={(value) => setValues({ ...values, dsaLevel: value })}
            >
              <SelectTrigger className="w-full bg-dark-3 border-none">
                <SelectValue placeholder="Select difficulty level" />
              </SelectTrigger>
              <SelectContent className="bg-dark-3 text-white">
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <label className="text-base font-normal leading-[22.4px] text-sky-2">
            Add a description
          </label>
          <Textarea
            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        </div>

        <div className="flex w-full flex-col gap-2.5">
          <label className="text-base font-normal leading-[22.4px] text-sky-2">
            Select Date and Time
          </label>
          <ReactDatePicker
            selected={values.dateTime}
            onChange={(date) => setValues({ ...values, dateTime: date! })}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full rounded bg-dark-3 p-2 focus:outline-none"
            minDate={new Date()}
            filterTime={(date) => new Date() < date}
          />
        </div>

        <button 
          onClick={createMeeting}
          className="bg-blue-1 px-4 py-2 rounded-md text-white"
        >
          Schedule Interview
        </button>
      </div>
    </section>
  );
};

export default DSAInterviewPage; 