#include<stdio.h>
main()
{
	float a,r,x,y,b,c;
printf("Enter the values of x and y of coordinate (Center)\n");
scanf("%f%f",&x,&y);
printf("Enter the value of radius\n");
scanf("%f",&r);
printf("Enter values of x and y of a point\n");
scanf("%f%f",&a,&b);
c=(a-x)*(a-x)+(b-y)*(b-y)-r*r;
if(c==0)
printf("point lies on Circle");
else
{
if(c>0)
printf("Point lies outside");
else
printf("point lies inside");
}
return 0;
}

