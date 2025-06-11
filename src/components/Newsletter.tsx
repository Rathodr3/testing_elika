
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Send, CheckCircle, Loader2, ArrowRight, Users, Bell, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email is required",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);

    try {
      // Simulate subscription
      console.log('Newsletter subscription:', { email, timestamp: new Date().toISOString() });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });

      setEmail('');

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const benefits = [
    {
      icon: Bell,
      title: "Latest Updates",
      description: "Get notified about new engineering trends and opportunities"
    },
    {
      icon: Users,
      title: "Industry Insights",
      description: "Exclusive content from industry experts and thought leaders"
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access to international engineering projects and placements"
    }
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl rotate-45"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/30 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-blue-400/40 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 mb-6">
                <Mail className="w-4 h-4 mr-2" />
                Newsletter Subscription
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Stay Ahead with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Industry Insights</span>
              </h2>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Join thousands of engineering professionals who trust us for the latest industry updates, job opportunities, and expert insights delivered directly to their inbox.
              </p>

              {/* Benefits Grid */}
              <div className="grid gap-6 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                      <benefit.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{benefit.title}</h4>
                      <p className="text-white/70">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-8 text-white/60 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>5000+ Subscribers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Weekly Updates</span>
                </div>
              </div>
            </div>

            {/* Right Side - Newsletter Form */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 lg:p-10 border border-white/20 shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Subscribe Now</h3>
                  <p className="text-white/70">Get started with your weekly dose of industry insights</p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-6">
                  <div className="relative">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-14 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl backdrop-blur-sm text-lg"
                      disabled={isSubscribing}
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={isSubscribing || !email.trim()}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                  >
                    {isSubscribing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        Subscribe to Newsletter
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-white/60 text-sm mt-6">
                  By subscribing, you agree to our Privacy Policy and Terms of Service. Unsubscribe at any time.
                </p>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
