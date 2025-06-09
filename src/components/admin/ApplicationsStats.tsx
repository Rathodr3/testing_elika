
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JobApplication } from '@/services/api';

interface ApplicationsStatsProps {
  applications: JobApplication[];
}

const ApplicationsStats = ({ applications }: ApplicationsStatsProps) => {
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-primary">{applications.length}</div>
          <div className="text-sm text-accent">Total Applications</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="text-sm text-accent">Pending</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(app => app.status === 'hired').length}
          </div>
          <div className="text-sm text-accent">Hired</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter(app => app.status === 'reviewing').length}
          </div>
          <div className="text-sm text-accent">Under Review</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsStats;
